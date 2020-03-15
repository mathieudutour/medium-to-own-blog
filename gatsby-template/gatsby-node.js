exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: Frontmatter
      fields: MediumMdxFields
    }
    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      published: Boolean
      canonical_link: String
      categories: [String]
      redirect_from: [String]
    }
    type MediumMdxFields {
      slug: String
      published: Boolean
    }
  `
  createTypes(typeDefs)
}
