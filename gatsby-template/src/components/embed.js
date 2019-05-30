/* eslint-disable jsx-a11y/iframe-has-title */
import React from 'react'

import './embed.css'

function Embed({ height, width, src }) {
  return (
    <div className="embed">
      <img
        aria-hidden
        alt="image to preserve aspect ratio of the iframe"
        src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3C/svg%3E`}
      />
      <iframe src={src} allowFullScreen frameBorder={0} />
    </div>
  )
}

export default Embed
