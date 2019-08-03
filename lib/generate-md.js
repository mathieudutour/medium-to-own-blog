const { JSDOM } = require('jsdom')
const { withOutputPath } = require('./utils')
const {
  getMarkdownFromOnlinePost,
  getMarkdownFromLocalPost,
} = require('./import-article-from-medium')

module.exports.getMarkdownFromPost = async (
  profile,
  localContent,
  fileName
) => {
  try {
    const localDom = new JSDOM(localContent).window.document

    if (localDom.querySelector('.p-canonical')) {
      const canonicalLink = localDom
        .querySelector('.p-canonical')
        .attributes.getNamedItem('href').value

      await getMarkdownFromOnlinePost(
        withOutputPath(profile, './content'),
        canonicalLink,
        localDom
      )
    } else {
      await getMarkdownFromLocalPost(
        withOutputPath(profile, './content'),
        localDom
      )
    }
  } catch (err) {
    err.message = `Error parsing ${fileName}: ${err.message}`
    throw err
  }
}
