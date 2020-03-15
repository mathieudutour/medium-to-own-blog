import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import Styled from '@emotion/styled'

const Wrapper = Styled.div`
  display: flex;
  margin-bottom: 4.375rem;
`

const StyledImage = Styled(Image)`
  margin-right: 0.875rem;
  margin-bottom: 0;
  min-width: 50px;
  border-radius: 100%;
`

function Bio() {
  const { site, avatar } = useStaticQuery(
    graphql`
      query BioQuery {
        avatar: file(absolutePath: { regex: "/avatar.png/" }) {
          childImageSharp {
            fixed(width: 50, height: 50, quality: 80) {
              base64
              width
              height
              src
              srcSet
            }
          }
        }
        site {
          siteMetadata {
            author
            shortBio
            social {
              twitter
            }
          }
        }
      }
    `
  )

  const { author, social, shortBio } = site.siteMetadata

  return (
    <Wrapper>
      <StyledImage
        fixed={avatar.childImageSharp.fixed}
        alt={author}
        imgStyle={{
          borderRadius: '50%',
        }}
      />
      <p style={{ margin: 0 }}>
        Written by <strong>{author}</strong>
        {shortBio ? ` ${shortBio}` : ''}.{` `}
        {social.twitter ? (
          <a href={`https://twitter.com/${social.twitter}`}>
            You should follow them on Twitter.
          </a>
        ) : null}
      </p>
    </Wrapper>
  )
}

export default Bio
