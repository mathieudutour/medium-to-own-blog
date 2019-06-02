const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      title: String
      description: String
      date: Date
      published: Boolean
      canonical_link: String
      categories: [String]
      redirect_from: [String]
    }
  `
  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'Mdx') {
    const value = createFilePath({ node, getNode })
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

exports.createPages = ({ graphql, actions, reporter, pathPrefix }) => {
  const { createPage, createRedirect } = actions
  return graphql(
    `
      {
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

      createPage({
        path: pagePath,
        component: path.resolve(`./src/templates/blog-post.js`),
        context: { id: node.id, previous, next },
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
    })
  })
}
