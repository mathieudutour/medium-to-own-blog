const withDefaults = require(`./utils/default-options`)

module.exports = themeOptions => {
  const options = withDefaults(themeOptions)
  const siteUrl = (options.config.siteUrl || '').replace(/^https?:\/\//i, '')

  const plugins = [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.md', '.mdx'],
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 700,
              backgroundColor: 'transparent',
              showCaptions: true,
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-embed-video',
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1.0725rem',
            },
          },
          'gatsby-remark-autolink-headers',
          'gatsby-remark-smartypants',
          {
            resolve: '@weknow/gatsby-remark-twitter',
            options: {
              align: 'center',
            },
          },
          'gatsby-remark-external-links',
        ],
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 700,
              backgroundColor: 'transparent',
              showCaptions: true,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: options.imagesPath,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blog',
        path: options.contentPath,
      },
    },
    'gatsby-plugin-netlify',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: options.config.title,
        short_name: options.config.title,
        start_url: '/',
        background_color: '#001724',
        theme_color: '#001724',
        display: 'minimal-ui',
        icon: `${options.imagesPath}/icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: [
          {
            title: options.config.title,
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.edges.map(edge => {
                return {
                  ...edge.node.frontmatter,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                }
              })
            },
            query: `
            {
              allMdx(
                filter: { fields: { published: { eq: true } } }
                limit: 1000,
                sort: {
                  order: DESC,
                  fields: [frontmatter___date]
                }
              ) {
                edges {
                  node {
                    frontmatter {
                      title
                      description
                      date
                    }
                    fields {
                      slug
                    }
                    html
                  }
                }
              }
            }
          `,
            output: `rss.xml`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-webmention`,
      options: {
        username: siteUrl,
        identity: {
          github: (options.config.social || {}).github,
          twitter: ((options.config.social || {}).twitter || '').replace(
            /^@/,
            ''
          ),
        },
        mentions: true,
        pingbacks: true,
        domain: siteUrl,
        token: options.webmentionsToken,
      },
    },
    `gatsby-plugin-netlify-cms`,
  ]

  return { plugins }
}
