const querystring = require('querystring')
const path = require('path')
const fs = require('fs-extra')
const { JSDOM } = require('jsdom')
const TurndownService = require('turndown')
const slugify = require('slugify')
const { request } = require('./utils')

//allowed mkdir character regex
const directoryRegex =  /[^\w\s$_+~()'!\-@]/g

let untitledCounter = 0
let imageDownloader = []
const iframeParser = {}

function replaceIframe(content, iframe, caption = '') {
  const source = iframe.attributes.getNamedItem('src').value

  if (iframeParser[source]) {
    // we already parsed an iframe pointing to the same thing
    // so return the result (or the placeholder if it isn't finished)

    if (!iframeParser[source].result && !iframeParser[source].caption) {
      iframeParser[source].caption = typeof caption !== 'string' ? '' : caption
    }

    return `\n\n${iframeParser[source].result ||
      iframeParser[source].placeholder ||
      ''}\n\n`
  }

  const placeholder = `Embed placeholder ${Math.random()}`

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

  iframeParser[source] = {
    caption: typeof caption !== 'string' ? '' : caption,
    placeholder,
    promise: request(`https://medium.com${source}`)
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
            }
          }

          // remove the placeholder if we can't find the source
          return {
            error: true,
          }
        }

        // something like https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fcz1t_oo6k9c%3Ffeature%3Doembed&url=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dcz1t_oo6k9c&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fcz1t_oo6k9c%2Fhqdefault.jpg&key=a19fcc184b9711e1b4764040d3dc5c07&type=text%2Fhtml&schema=youtube
        const nestedSource = nestedIframe.attributes.getNamedItem('src').value
        const query = querystring.parse(nestedSource.split('?')[1])

        return {
          src: query.src,
          url: query.url,
        }
      })
      .catch(() => ({ error: true })),
  }

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
  replacement(content, node) {
    const iframe = node.querySelector('iframe')
    if (iframe) {
      return replaceIframe('', iframe, content.split('\n')[2])
    }

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

async function writePost(contentFolder, slug, md, metadata) {
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
canonical_link: ${metadata.canonicalLink}`
      : ''
  }${
    metadata.redirect
      ? `
redirect_from:
  - /${metadata.redirect}`
      : ''
  }
---

`

  await fs.mkdirp(path.join(contentFolder, `./${slug}`))

  await Promise.all(
    imageDownloader
      .map(p =>
        p.then(({ body, filename }) => {
          if (body) {
            fs.writeFile(
              path.join(contentFolder, `./${slug}/${filename}`),
              body
            )
          }
        })
      )
      .concat(
        Object.keys(iframeParser)
          .filter(k => iframeParser[k].promise)
          .map(k => {
            const { promise, placeholder, caption } = iframeParser[k]
            return promise.then(({ src, aspectRatio }) => {
              const result = `<Embed src="${src}" aspectRatio={${aspectRatio}} caption="${caption}" />`
              iframeParser[k] = { result }
              if (src) {
                md = md.replace(new RegExp(placeholder, 'g'), result)
              } else if (placeholder) {
                // remove the placeholder if we can't find the source
                md = md.replace(new RegExp(placeholder, 'g'), '')
              }
            })
          })
      )
  )

  await fs.writeFile(
    path.join(contentFolder, `./${slug}/index.md`),
    `${frontmatter}${md}\n`
  )

  return slug
}

module.exports.getMarkdownFromOnlinePost = async (
  contentFolder,
  canonicalLink,
  localDom
) => {
  imageDownloader = []

  const metadata = {}
  let md = ''

  const onlineContent = await request(canonicalLink)
  const onlineDom = new JSDOM(onlineContent).window.document

  if (onlineDom.querySelector('.a.b.c')) {
    // we are in trouble. Medium recently changed their css and now
    // all the classes are random letters.
    // we could potentially try to map the letters to the proper classes
    // but the letters might change on every deployment depending on their
    // build system
    // so we are just going to bail out and parse the local file while printing
    // a warning saying that it might be a response and that there won't be tags

    if (!localDom) {
      return undefined
    }

    const redirect = canonicalLink
      ? path.basename(decodeURI(canonicalLink))
      : undefined

    const title =
      (
        localDom.querySelector('.p-name') || { textContent: '' }
      ).textContent.trim() || `Untitled Draft ${++untitledCounter}`

    const slug = title ? slugify(title, {remove: directoryRegex, lower: true}) : redirect || ''

    console.warn(`

⚠️  The "${slug}" article might be a response to another article and we couldn't parse its categories. You might want to touch it up manually.
    `)

    return module.exports.getMarkdownFromLocalPost(
      contentFolder,
      localDom,
      canonicalLink
    )
  }

  if (
    onlineDom.querySelector('.postArticle--response') ||
    !onlineDom.querySelector('.postArticle-content')
  ) {
    // that's a response to another article
    // so we will ignore that
    return undefined
  }

  const tags = Array.from(onlineDom.querySelectorAll('.js-postTags li'))

  const titleElement = onlineDom.querySelector('.graf--title')

  // some articles might not have a title
  const title = titleElement ? titleElement.textContent : ''

  const redirect = path.basename(decodeURI(canonicalLink))

  const slug = title ? slugify(title, {remove: directoryRegex, lower: true}) : redirect

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
  metadata.redirect = redirect

  return writePost(contentFolder, slug, md, metadata)
}

module.exports.getMarkdownFromLocalPost = async (
  contentFolder,
  localDom,
  canonicalLink
) => {
  imageDownloader = []

  const metadata = {}
  let md = ''

  const redirect = canonicalLink
    ? path.basename(decodeURI(canonicalLink))
    : undefined

  const title =
    (
      localDom.querySelector('.p-name') || { textContent: '' }
    ).textContent.trim() || `Untitled Draft ${++untitledCounter}`

  const slug = title ? slugify(title, {remove: directoryRegex, lower: true}) : redirect || ''

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
  metadata.date = localDom.querySelector('.dt-published')
    ? localDom
        .querySelector('.dt-published')
        .attributes.getNamedItem('datetime').value
    : new Date().toISOString()
  metadata.published = !!canonicalLink
  metadata.canonicalLink = canonicalLink
  metadata.redirect = redirect

  return writePost(contentFolder, slug, md, metadata)
}
