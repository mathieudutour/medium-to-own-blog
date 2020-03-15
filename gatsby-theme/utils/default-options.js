module.exports = themeOptions => {
  const basePath = themeOptions.basePath || `/`
  const contentPath = themeOptions.contentPath || `content`
  const imagesPath = themeOptions.imagesPath || `src/images`

  const config = themeOptions.config || {}

  return {
    basePath,
    contentPath,
    imagesPath,
    config,
  }
}
