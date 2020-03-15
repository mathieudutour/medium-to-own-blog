module.exports = themeOptions => {
  const pathPrefix = themeOptions.pathPrefix || ``
  const contentPath = themeOptions.contentPath || `content`
  const imagesPath = themeOptions.imagesPath || `src/images`

  const config = themeOptions.config || {}

  return {
    pathPrefix,
    contentPath,
    imagesPath,
    config,
  }
}
