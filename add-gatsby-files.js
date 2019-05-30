const fs = require('fs-extra')
const path = require('path')
const { withOutputPath } = require('./utils')

module.exports.addGatsbyFiles = profile => {
  function replaceTemplate(content) {
    return content
      .replace(/{{ mediumUsername }}/g, profile.mediumUsername || '')
      .replace(/{{ authorName }}/g, profile.authorName || '')
      .replace(/{{ authorEmail }}/g, profile.authorEmail || '')
      .replace(/{{ twitterUsername }}/g, profile.twitterUsername || '')
      .replace(/{{ facebookUsername }}/g, profile.facebookUsername || '')
      .replace(/{{ bio }}/g, profile.bio || '')
  }

  function copyTemplate(fileName) {
    return fs
      .readFile(path.join(__dirname, `./gatsby-template/${fileName}`), 'utf8')
      .then(replaceTemplate)
      .then(content =>
        fs.writeFile(withOutputPath(profile, `./${fileName}`), content)
      )
  }

  return Promise.all([
    copyTemplate('README.md'),
    copyTemplate('package.json'),
    copyTemplate('netlify.toml'),
    copyTemplate('gatsby-ssr.js'),
    copyTemplate('gatsby-node.js'),
    copyTemplate('gatsby-config.js'),
    copyTemplate('gatsby-browser.js'),
    copyTemplate('.travis.yml'),
    copyTemplate('.gitignore'),
    copyTemplate('.eslintrc.yml'),
    fs.copy(
      path.join(__dirname, './gatsby-template/src'),
      withOutputPath(profile, './src')
    ),
    fs.copy(
      path.join(__dirname, './gatsby-template/static'),
      withOutputPath(profile, './static')
    ),
  ])
}
