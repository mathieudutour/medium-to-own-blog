import React from 'react'
import { Link, graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Styled from '@emotion/styled'

import SEO from '../components/seo'
import Section from '../components/section'
import Pills from '../components/pills'
import Bio from '../components/bio'
import Embed from '../components/embed'
import Responses from '../components/responses'
import Layout from '../components/layout'
import { formatPostDate, formatReadingTime } from '../utils/dates'

const BackLink = Styled(Link)`
  text-decoration: none;
  font-size: 48px;
  color: lavender;
  margin-left: -40px;
`

const Header = Styled.header`
  margin-top: 5em;
  margin-bottom: 2em;

  & p {
    font-size: 0.75em;
  }
`

const Footer = Styled.footer`
  margin-top: 4em;
  text-align: left;

  & small {
    font-size: 0.8em;
    opacity: 0.7;
  }

  & small a {
    font-size: 17px;
  }
`

const Separator = Styled.hr`
  margin: 24px 0;
  border: 0;
  background: rgba(0, 0, 0, 0.1);
  height: 1px;
`

const Likes = Styled.a`
  float: right;
  text-decoration: none;
  margin-top: 0;
`

export default function PageTemplate({
  data: { mdx, site, allWebMentionEntry },
  pageContext,
}) {
  const { previous, next, permalink } = pageContext

  const webmentions = (allWebMentionEntry || {}).nodes || []

  const likes = webmentions.filter(x => x.wmProperty === 'like-of')
  const responses = webmentions.filter(x => x.wmProperty === 'in-reply-to')

  return (
    <Layout>
      <SEO
        title={mdx.frontmatter.title}
        description={mdx.frontmatter.description || mdx.excerpt}
        canonicalLink={mdx.frontmatter.canonical_link}
        keywords={mdx.frontmatter.categories || []}
        meta={[
          {
            name: 'twitter:label1',
            content: 'Reading time',
          },
          {
            name: 'twitter:data1',
            content: `${mdx.timeToRead} min read`,
          },
        ]}
      />
      <Section centered>
        <article>
          <Header>
            <h1>
              <BackLink to="/">«</BackLink> {mdx.frontmatter.title}
            </h1>
            <p>
              {formatPostDate(mdx.frontmatter.date)}
              {` • ${formatReadingTime(mdx.timeToRead)}`}
            </p>
            <Pills items={mdx.frontmatter.categories} />
          </Header>

          <MDXRenderer scope={{ Embed }}>{mdx.body}</MDXRenderer>
        </article>
        <Footer>
          <Likes
            target="_blank"
            rel="nofollow noopener noreferrer"
            href={`https://twitter.com/search?q=${permalink}`}
          >
            ♡{' '}
            {likes.length
              ? `${likes.length} like${likes.length > 1 ? 's' : ''}`
              : 'Like'}
          </Likes>
          <small>
            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href={`https://twitter.com/search?q=${permalink}`}
            >
              Discuss on Twitter
            </a>{' '}
            &middot;{' '}
            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href={`${site.siteMetadata.githubUrl}/edit/master/content${mdx.fields.slug}index.md`}
            >
              Edit this post on GitHub
            </a>
          </small>
          <Separator />
          <Bio />
          <Separator />
          {responses.length ? (
            <div>
              <Responses responses={responses} />
              <Separator />
            </div>
          ) : null}
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </Footer>
      </Section>
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String, $permalink: String) {
    site {
      siteMetadata {
        siteUrl
        githubUrl
      }
    }
    mdx(id: { eq: $id }) {
      fields {
        slug
      }
      excerpt
      timeToRead
      frontmatter {
        title
        description
        categories
        date(formatString: "MMMM DD, YYYY")
        canonical_link
      }
      body
    }
    allWebMentionEntry(filter: { wmTarget: { eq: $permalink } }) {
      nodes {
        wmProperty
        wmId
        url
        wmReceived
        author {
          url
          photo
          name
        }
        content {
          text
        }
        video
      }
    }
  }
`
