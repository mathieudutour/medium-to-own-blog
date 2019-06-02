const querystring = require('querystring')
const path = require('path')
const fs = require('fs-extra')
const { JSDOM } = require('jsdom')
const TurndownService = require('turndown')
const slugify = require('slugify')
const { request, withOutputPath } = require('./utils')

let untitledCounter = 0
let imageDownloader = []
let iframeParser = []

function replaceIframe(content, iframe) {
  const placeholder = `Embed placeholder ${Math.random()}`
  const source = iframe.attributes.getNamedItem('src').value

  let aspectRatioPlaceholder = iframe

  while (
    !aspectRatioPlaceholder.classList.contains('aspectRatioPlaceholder') &&
    aspectRatioPlaceholder.parentNode
  ) {
    aspectRatioPlaceholder = aspectRatioPlaceholder.parentNode
  }

  const aspectRatioFill =
    aspectRatioPlaceholder &&
    aspectRatioPlaceholder.querySelector('.aspectRatioPlaceholder-fill')

  const aspectRatio = aspectRatioFill
    ? parseFloat(aspectRatioFill.style.paddingBottom) / 100
    : 1

  iframeParser.push(
    request(`https://medium.com${source}`)
      .then(body => {
        const iframeDom = new JSDOM(body).window.document
        const nestedIframe = iframeDom.querySelector('iframe')

        if (!nestedIframe) {
          // check if it's a gist
          const gist = iframeDom.querySelector(
            'script[src^="https://gist.github.com"]'
          )

          if (gist) {
            return {
              src: gist.attributes.getNamedItem('src').value,
              aspectRatio,
              placeholder,
            }
          }

          // remove the placeholder if we can't find the source
          return {
            error: true,
            placeholder,
          }
        }

        // something like https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fcz1t_oo6k9c%3Ffeature%3Doembed&url=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dcz1t_oo6k9c&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fcz1t_oo6k9c%2Fhqdefault.jpg&key=a19fcc184b9711e1b4764040d3dc5c07&type=text%2Fhtml&schema=youtube
        const nestedSource = nestedIframe.attributes.getNamedItem('src').value
        const query = querystring.parse(nestedSource.split('?')[1])

        return {
          src: query.src,
          url: query.url,
          aspectRatio,
          placeholder,
        }
      })
      .catch(() => ({}))
  )
  return `\n\n${placeholder}\n\n`
}

const config = {
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  blankReplacement(content, node) {
    if (node.nodeName === 'FIGURE') {
      const iframe = node.querySelector('iframe')
      if (iframe) {
        return replaceIframe('', iframe)
      }
    }
    if (node.nodeName === 'IFRAME') {
      return replaceIframe('', node)
    }
    return node.isBlock ? '\n\n' : ''
  },
}
const td = new TurndownService(config)

td.addRule('iframe', {
  filter: ['iframe', 'IFRAME'],
  replacement: replaceIframe,
})

// parsing figure and figcaption for markdown
td.addRule('figure', {
  filter: 'figure',
  replacement(content) {
    // eslint-disable-next-line prefer-const
    let [, , element, , caption] = content.split('\n')
    if (caption) {
      // the caption
      element = [element.slice(0, 2), caption, element.slice(2)].join('')
    }

    return element
  },
})

// parsing code block
td.addRule('code-blocks', {
  filter: ['pre'],
  replacement(content, node) {
    let string = ``
    if (!node.classList.contains('graf-after--pre')) {
      string += '```\n'
    } else {
      string += '\n\n'
    }

    // replace all the `<br />` to maintain code formatting
    node.querySelectorAll('br').forEach(child => child.replaceWith('\n'))

    string += node.textContent
    string += '\n'

    if (
      !node.nextElementSibling ||
      node.nextElementSibling.nodeName !== 'PRE'
    ) {
      string += '```'
    }

    return string
  },
})

// some `code` has siblings inside `pre`
td.addRule('code', {
  filter(node) {
    const isCodeBlock = node.parentNode.nodeName === 'PRE'

    return node.nodeName === 'CODE' && !isCodeBlock
  },
  replacement(content) {
    if (!content.trim()) return ''

    let delimiter = '`'
    let leadingSpace = ''
    let trailingSpace = ''
    const matches = content.match(/`+/gm)
    if (matches) {
      if (/^`/.test(content)) leadingSpace = ' '
      if (/`$/.test(content)) trailingSpace = ' '
      while (matches.indexOf(delimiter) !== -1) delimiter += '`'
    }

    return delimiter + leadingSpace + content + trailingSpace + delimiter
  },
})

// override the default image rule to download the image from the medium CDN
td.addRule('image', {
  filter: 'img',

  replacement(content, node) {
    const alt = node.alt || ''
    let src = node.getAttribute('src') || ''

    if (/^https:\/\/cdn-images.*\.medium\.com/.test(src)) {
      const cdnURL = src
      const filename = `asset-${imageDownloader.length + 1}${path.extname(src)}`
      src = `./${filename}`
      imageDownloader.push(
        request(cdnURL, { encoding: null })
          .then(body => ({ body, filename }))
          .catch(() => ({})) // we will just ignore the error
      )
    }

    const title = node.title || ''
    const titlePart = title ? ` "${title}"` : ''
    return src ? `![${alt}](${src}${titlePart})` : ''
  },
})

module.exports.getMarkdownFromPost = async (
  profile,
  localContent,
  fileName
) => {
  try {
    imageDownloader = []
    iframeParser = []
    const localDom = new JSDOM(localContent).window.document

    const metadata = {}
    let md = ''

    let slug

    if (localDom.querySelector('.p-canonical')) {
      const canonicalLink = localDom
        .querySelector('.p-canonical')
        .attributes.getNamedItem('href').value

      const onlineContent = await request(canonicalLink)
      const onlineDom = new JSDOM(onlineContent).window.document

      const tags = Array.from(onlineDom.querySelectorAll('.js-postTags li'))

      if (tags.length === 0) {
        // that's a comment
        return
      }

      const titleElement = onlineDom.querySelector('.graf--title')

      // some articles might not have a title
      const title = titleElement ? titleElement.textContent : ''

      slug = title
        ? slugify(title).toLowerCase()
        : path.basename(decodeURI(canonicalLink))

      // remove some extra stuff from the html
      if (titleElement) {
        titleElement.remove()
      }
      if (onlineDom.querySelector('.section-divider')) {
        onlineDom.querySelector('.section-divider').remove()
      }
      if (onlineDom.querySelector('.js-postMetaLockup')) {
        onlineDom.querySelector('.js-postMetaLockup').remove()
      }

      md = td.turndown(onlineDom.querySelector('.postArticle-content'))

      const canonicalMeta = onlineDom.querySelector("link[rel='canonical']")

      metadata.title = title
      metadata.description = onlineDom
        .querySelector("meta[name='description']")
        .attributes.getNamedItem('content').value
      metadata.date = onlineDom
        .querySelector("meta[property='article:published_time']")
        .attributes.getNamedItem('content').value
      metadata.categories = tags.map(t => t.textContent)
      metadata.published = true
      metadata.canonicalLink = canonicalMeta
        ? canonicalMeta.attributes.getNamedItem('href').value
        : canonicalLink
    } else {
      // that's a draft
      const title =
        (
          localDom.querySelector('.p-name') || { textContent: '' }
        ).textContent.trim() || `Untitled Draft ${++untitledCounter}`

      slug = slugify(title).toLowerCase()

      // remove some extra stuff from the html
      if (localDom.querySelector('.p-name')) {
        localDom.querySelector('.p-name').remove()
      }
      if (localDom.querySelector('.graf--title')) {
        localDom.querySelector('.graf--title').remove()
      }
      if (localDom.querySelector('.graf--subtitle')) {
        localDom.querySelector('.graf--subtitle').remove()
      }
      if (localDom.querySelector('.section-divider')) {
        localDom.querySelector('.section-divider').remove()
      }

      md = td.turndown(localDom.querySelector('.e-content'))

      metadata.title = title
      metadata.description = (
        localDom.querySelector('.p-summary[data-field="subtitle"]') || {
          textContent: '',
        }
      ).textContent.trim()
      metadata.date = new Date().toISOString()
      metadata.published = false
    }

    const frontmatter = `---
title: ${JSON.stringify(metadata.title)}
description: ${JSON.stringify(metadata.description)}
date: "${metadata.date}"
categories: ${
      metadata.categories
        ? `
${metadata.categories.map(c => `  - ${c}`).join('\n')}
`
        : '[]'
    }
published: ${metadata.published ? 'true' : 'false'}${
      metadata.canonicalLink
        ? `
canonicalLink: ${metadata.canonicalLink}`
        : ''
    }
---

`

    await fs.mkdirp(withOutputPath(profile, `./content/${slug}`))

    await Promise.all(
      imageDownloader
        .map(p =>
          p.then(({ body, filename }) => {
            if (body) {
              fs.writeFile(
                withOutputPath(profile, `./content/${slug}/${filename}`),
                body
              )
            }
          })
        )
        .concat(
          iframeParser.map(p =>
            p.then(({ src, placeholder, aspectRatio }) => {
              if (src) {
                md = md.replace(
                  placeholder,
                  `<Embed src="${src}" aspectRatio={${aspectRatio}} />`
                )
              } else if (placeholder) {
                // remove the placeholder if we can't find the source
                md = md.replace(placeholder, '')
              }
            })
          )
        )
    )

    await fs.writeFile(
      withOutputPath(profile, `./content/${slug}/index.md`),
      `${frontmatter}${md}\n`
    )
  } catch (err) {
    err.message = `Error parsing ${fileName}: ${err.message}`
    throw err
  }
}
