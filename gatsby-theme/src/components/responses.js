import React, { useState } from 'react'

import { formatPostDate } from '../utils/dates'

import './responses.css'

function Avatar({ author, published }) {
  return (
    <div
      style={{
        display: 'flex',
        marginBottom: '1rem',
      }}
    >
      <img
        src={author.photo}
        alt={author.name}
        style={{
          height: 36,
          width: 36,
          marginRight: '0.875rem',
          marginBottom: 0,
          borderRadius: '100%',
        }}
      />
      <div>
        <p style={{ margin: 0, lineHeight: 0.6 }}>
          <a
            target="_blank"
            rel="nofollow noopener noreferrer"
            style={{ fontSize: 16, textDecoration: 'none', lineHeight: 0 }}
            href={author.url}
          >
            {author.name}
          </a>
        </p>
        <time
          style={{ margin: 0, fontSize: 15, color: 'rgba(0, 0, 0, 0.54)' }}
          dateTime={published}
        >
          {formatPostDate(published)}
        </time>
      </div>
    </div>
  )
}

function Responses({ responses }) {
  const [showingResponses, setShowingResponses] = useState(false)

  if (!responses.length) {
    return null
  }

  if (!showingResponses) {
    return (
      <button
        type="button"
        onClick={() => setShowingResponses(true)}
        className="show-responses"
      >
        See {responses.length} response{responses.length > 1 ? 's' : ''}
      </button>
    )
  }

  return (
    <ul className="responses">
      {responses.map(response => (
        <li>
          <a
            target="_blank"
            rel="nofollow noopener noreferrer"
            style={{ textDecoration: 'none' }}
            href={response.url}
          >
            <Avatar author={response.author} published={response.wmReceived} />
            <div>{response.content && response.content.text}</div>
            <div className="video-content">
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
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default Responses
