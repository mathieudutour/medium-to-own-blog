#!/usr/bin/env node

const path = require('path')
const inquirer = require('inquirer')
const ora = require('ora')
const {
  getMarkdownFromOnlinePost,
} = require('../lib/import-article-from-medium')

// eslint-disable-next-line no-console
console.log(`    -------------------------

Hello there!

Let's import one of your Medium article here.
`)

let spinner

inquirer
  .prompt([
    {
      name: 'canonicalLink',
      message: 'URL of the Medium article',
    },
  ])
  .then(({ canonicalLink }) => {
    canonicalLink = canonicalLink.trim()
    if (!canonicalLink) {
      throw new Error(`
We do need the URL to import the article...`)
    }
    spinner = ora('Parsing Medium article').start()

    return getMarkdownFromOnlinePost(
      path.join(process.cwd(), './content'),
      canonicalLink
    )
  })
  .then(slug => {
    if (!slug) {
      throw new Error(
        'Looks like the URL points to a draft or a response to an article. We cannot import that.'
      )
    }
    // eslint-disable-next-line no-console
    console.log(`
    -------------------------

Your article is ready to go! 🙌

You can find it here: ${path.join(process.cwd(), './content', slug)}

Happy blogging!
...


`)
  })
  .then(() => process.exit(0))
  .catch(err => {
    if (spinner) {
      spinner.fail()
    }
    // eslint-disable-next-line no-console
    console.log()
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  })
