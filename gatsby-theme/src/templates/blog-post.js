import React from 'react'
import { Link, graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'

import SEO from '../components/seo'
import Pills from '../components/pills'
import Bio from '../components/bio'
import Embed from '../components/embed'
import Responses from '../components/responses'
import { formatPostDate, formatReadingTime } from '../utils/dates'

import './blog-post.css'

export default function PageTemplate({
  data: { mdx, site, allWebMentionEntry },
  pageContext,
}) {
  const { previous, next, permalink } = pageContext

  const webmentions = (allWebMentionEntry || {}).nodes || []

  const likes = webmentions.filter(x => x.wmProperty === 'like-of')
  const responses = webmentions.filter(x => x.wmProperty === 'in-reply-to')

  return (
    <div>
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
      <section className="center blog">
        <article className="container small">
          <header>
            <h1>
              <Link to="/">«</Link> {mdx.frontmatter.title}
            </h1>
            <p>
              {formatPostDate(mdx.frontmatter.date)}
              {` • ${formatReadingTime(mdx.timeToRead)}`}
            </p>
            <Pills items={mdx.frontmatter.categories} />
          </header>

          <MDXRenderer scope={{ Embed }}>{mdx.body}</MDXRenderer>
        </article>
        <footer className="container small">
          <a
            className="footer-likes"
            target="_blank"
            rel="nofollow noopener noreferrer"
            href={`https://twitter.com/search?q=${permalink}`}
          >
            ♡{' '}
            {likes.length
              ? `${likes.length} like${likes.length > 1 ? 's' : ''}`
              : 'Like'}
          </a>
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
          <hr
            style={{
              margin: `24px 0`,
            }}
          />
          <Bio />
          <hr
            style={{
              margin: `24px 0`,
            }}
          />
          {responses.length ? (
            <div>
              <Responses responses={responses} />
              <hr
                style={{
                  margin: `24px 0`,
                }}
              />
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
        </footer>
      </section>
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
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
  }
`

// export const pageQuery = graphql`
//   query BlogPostQuery($id: String, $permalink: String) {
//     site {
//       siteMetadata {
//         siteUrl
//         githubUrl
//       }
//     }
//     mdx(id: { eq: $id }) {
//       fields {
//         slug
//       }
//       excerpt
//       timeToRead
//       frontmatter {
//         title
//         description
//         categories
//         date(formatString: "MMMM DD, YYYY")
//         canonical_link
//       }
//       body
//     }
//     allWebMentionEntry(filter: { wmTarget: { eq: $permalink } }) {
//       nodes {
//         wmProperty
//         wmId
//         url
//         wmReceived
//         author {
//           url
//           photo
//           name
//         }
//         content {
//           text
//         }
//         video
//       }
//     }
//   }
// `
