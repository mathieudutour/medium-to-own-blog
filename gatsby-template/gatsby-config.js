const config = require('./config')

module.exports = {
  siteMetadata: config,
  plugins: [
    {
      resolve: `gatsby-theme-medium-to-own-blog`,
      options: {
        config,
        webmentionsToken: process.env.WEBMENTIONS_TOKEN,
      },
    },
  ],
}
