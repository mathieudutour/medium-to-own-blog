/**
 * This react helmt code is adapted from
 * https://themeteorchef.com/tutorials/reusable-seo-with-react-helmet.
 *
 * A great tutorial explaining how to setup a robust version of an
 * SEO friendly react-helmet instance.
 *
 *
 * Use the Helmt on pages to generate SEO and meta content!
 *
 * Usage:
 * <SEO
 *   title={title}
 *   description={description}
 *   image={image}
 * />
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

function SEO({
  description,
  lang,
  meta,
  keywords,
  title,
  canonicalLink,
  image,
}) {
  const { site, avatar } = useStaticQuery(
    graphql`
      query {
        avatar: file(absolutePath: { regex: "/avatar.png/" }) {
          childImageSharp {
            fixed(width: 150, height: 150, quality: 90) {
              src
            }
          }
        }
        site {
          siteMetadata {
            siteUrl
            title
            description
            author
            social {
              twitter
            }
          }
        }
      }
    `
  )

  const fullURL = path =>
    path ? `${site.siteMetadata.siteUrl}${path}` : site.siteUrl

  const metaDescription = description || site.siteMetadata.description
  const metaTitle = title || site.siteMetadata.title

  // If no image is provided lets use the avatar
  const socialImage = image || avatar.childImageSharp.fixed.src

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      meta={[
        { charset: 'utf-8' },
        {
          'http-equiv': 'X-UA-Compatible',
          content: 'IE=edge',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'theme-color',
          content: '#fff',
        },
        { itemprop: 'name', content: metaTitle },
        {
          name: `description`,
          content: metaDescription,
        },
        { itemprop: 'image', content: fullURL(socialImage) },
        {
          property: `og:title`,
          content: title || site.siteMetadata.title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        { property: 'og:image', content: fullURL(socialImage) },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.social.twitter,
        },
        {
          name: `twitter:site`,
          content: site.siteMetadata.social.twitter,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: 'twitter:image',
          content: fullURL(socialImage),
        },
      ]
        .concat(
          keywords && keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`, `),
              }
            : []
        )
        .concat(meta)}
      link={[].concat(
        canonicalLink
          ? {
              rel: `canonical`,
              href: canonicalLink,
            }
          : []
      )}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  keywords: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  canonicalLink: PropTypes.string,
  image: PropTypes.string,
}

export default SEO
