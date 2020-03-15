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

    type WebMentionEntry implements Node {
      type: String
      author: WebMentionAuthor
      content: WebMentionContent
      url: String
      published: Date @dateformat
      wmReceived: Date @dateformat
      wmId: Int
      wmPrivate: Boolean
      wmTarget: String
      wmSource: String
      wmProperty: String
      likeOf: String
      mentionOf: String
      inReplyTo: String
      repostOf: String
      bookmarkOf: String
      rsvp: String
      video: [String]
    }
    type WebMentionAuthor {
      type: String
      name: String
      url: String
      photo: String
    }
    type WebMentionContent {
      text: String
      html: String
    }
  `
  createTypes(typeDefs)
}
