import React from 'react'
import { graphql, Link } from 'gatsby'
import Styled from '@emotion/styled'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Section from '../components/section'
import Pills from '../components/pills'
import MainBio from '../components/main-bio'
import { formatPostDate, formatReadingTime } from '../utils/dates'

const BlogListing = Styled(Link)`
  display: block;
  margin-top: 2em;
  margin-bottom: 2em;
  text-decoration: none;

  & p {
    margin-top: 1rem;
  }

  & h1 {
    margin-bottom: 1rem;
  }
`

const BlogIndexPage = ({ data: { allMdx } }) => (
  <Layout>
    <SEO />
    <Section centered name="main-bio">
      <MainBio />
    </Section>

    {allMdx.nodes.map(post => (
      <Section key={post.fields.slug} name={post.fields.slug} centered>
        <BlogListing to={post.fields.slug}>
          <h1>{post.frontmatter.title}</h1>
          <p>
            {formatPostDate(post.frontmatter.date)}
            {` • ${formatReadingTime(post.timeToRead)}`}
          </p>
          <Pills items={post.frontmatter.categories} />
          <p>{post.frontmatter.description}</p>
        </BlogListing>
      </Section>
    ))}
  </Layout>
)

export default BlogIndexPage

export const query = graphql`
  query BlogIndex {
    allMdx(
      filter: { fields: { published: { eq: true } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        fields {
          slug
        }
        timeToRead
        frontmatter {
          title
          description
          categories
          date(formatString: "MMMM DD, YYYY")
        }
      }
    }
  }
`
