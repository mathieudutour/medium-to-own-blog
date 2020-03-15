import React, { useState } from 'react'
import Styled from '@emotion/styled'

import { formatPostDate } from '../utils/dates'
import theme from '../../theme'

const AvatarWrapper = Styled.div`
  display: flex;
  margin-bottom: 1rem;
`

const AvatarImage = Styled.img`
  height: 36px;
  width: 36px;
  margin-right: 0.875rem;
  margin-bottom: 0;
  border-radius: 100%;
`

const Time = Styled.time`
  margin: 0;
  font-size: 15px;
  color: ${theme.colors.grey};
`

const AuthorNameWrapper = Styled.p`
  margin: 0;
  line-height: 0.6px;
`

const AuthorName = Styled.a`
  font-size: 16px;
  text-decoration: none;
  line-height: 0;
  color: ${theme.colors.text};
`

function Avatar({ author, published }) {
  return (
    <AvatarWrapper>
      <AvatarImage src={author.photo} alt={author.name} />
      <div>
        <AuthorNameWrapper>
          <AuthorName
            target="_blank"
            rel="nofollow noopener noreferrer"
            href={author.url}
          >
            {author.name}
          </AuthorName>
        </AuthorNameWrapper>
        <Time dateTime={published}>{formatPostDate(published)}</Time>
      </div>
    </AvatarWrapper>
  )
}

const ShowReponses = Styled.button`
  cursor: pointer;
  width: 100%;
  color: rgba(0, 0, 0, 0.84);
  border: 1px solid lavender;
  border-radius: 3px;
  padding: 20px;
  text-align: center;
  font-size: 14px;
`

const Wrapper = Styled.ul`
  list-style: none;
  padding: 0;

  & li {
    box-shadow: ${theme.shadows.box};
    border: 1px solid ${theme.colors.boxBorder};
    padding: 15px 20px;
  }

  & li + li {
    margin-top: 1.5rem;
  }
`

const VideoContent = Styled.div`
  text-align: center;

  & video {
    max-width: 100%;
  }
`

const ResponseLink = Styled.a`
  text-decoration: none;
`

function Responses({ responses }) {
  const [showingResponses, setShowingResponses] = useState(false)

  if (!responses.length) {
    return null
  }

  if (!showingResponses) {
    return (
      <ShowReponses type="button" onClick={() => setShowingResponses(true)}>
        See {responses.length} response{responses.length > 1 ? 's' : ''}
      </ShowReponses>
    )
  }

  return (
    <Wrapper>
      {responses.map(response => (
        <li>
          <ResponseLink
            target="_blank"
            rel="nofollow noopener noreferrer"
            href={response.url}
          >
            <Avatar author={response.author} published={response.wmReceived} />
            <div>{response.content && response.content.text}</div>
            <VideoContent>
              {response.video && response.video.length
                ? response.video.map(v => (
                    <video controls muted autoPlay loop>
                      <source src={v} type="video/mp4" />
                      <p>
                        Your browser doesn't support HTML5 video. Here is a{' '}
                        <a href={v}>link to the video</a> instead.
                      </p>
                    </video>
                  ))
                : null}
            </VideoContent>
          </ResponseLink>
        </li>
      ))}
    </Wrapper>
  )
}

export default Responses
