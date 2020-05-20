const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, actions, getNode }, themeOptions) => {
  const { createNodeField } = actions

  if (node.internal.type === 'Mdx') {
    let value = `${
      themeOptions.pathPrefix ? themeOptions.pathPrefix : ''
    }${createFilePath({ node, getNode })}`
    if (!value.startsWith('/')) {
      value = `/${value}`
    }
    createNodeField({
      name: 'slug',
      node,
      value,
    })

    createNodeField({
      name: 'published',
      node,
      value: node.frontmatter.published,
    })
  }
}

exports.createPages = (
  { graphql, actions, reporter, pathPrefix },
  themeOptions
) => {
  const { createPage, createRedirect } = actions
  return graphql(
    `
      {
        site {
          siteMetadata {
            siteUrl
          }
        }
        allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
          edges {
            node {
              id
              fields {
                slug
                published
              }
              frontmatter {
                redirect_from
                redirect_to
                title
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors && result.errors.length) {
      if (result.errors.length === 1) {
        throw new Error(result.errors[0])
      }

      result.errors.forEach(error => {
        reporter.error('Error while querying the mdx', error)
      })

      throw new Error('See errors above')
    }

    const posts = result.data.allMdx.edges
    // We'll call `createPage` for each result
    posts.forEach(({ node }, index) => {
      let previous = index === posts.length - 1 ? null : posts[index + 1].node
      let next = index === 0 ? null : posts[index - 1].node

      if (previous && !previous.fields.published) {
        previous = null
      }
      if (next && !next.fields.published) {
        next = null
      }

      const pagePath = `${pathPrefix}${node.fields.slug}`
      const permalink = `${result.data.site.siteMetadata.siteUrl}${node.fields.slug}`

      createPage({
        path: pagePath,
        component: path.resolve(
          path.join(__dirname, `./src/templates/blog-post.js`)
        ),
        context: { id: node.id, previous, next, permalink, themeOptions },
      })

      if (
        node.frontmatter &&
        node.frontmatter.redirect_from &&
        Array.isArray(node.frontmatter.redirect_from) &&
        node.frontmatter.redirect_from.length
      ) {
        node.frontmatter.redirect_from.forEach(fromPath => {
          createRedirect({
            fromPath,
            toPath: pagePath,
            isPermanent: true,
          })
        })
      }

      if (
        node.frontmatter &&
        node.frontmatter.redirect_to &&
        node.frontmatter.redirect_to.length
      ) {
        createRedirect({
          fromPath: pagePath,
          toPath: node.frontmatter.redirect_to,
          isPermanent: true,
          redirectInBrowser: true,
        })
      }
    })
  })
}
