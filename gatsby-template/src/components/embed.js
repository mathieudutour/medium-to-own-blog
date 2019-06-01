/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useRef, useEffect } from 'react'

import './embed.css'

function Embed({ aspectRatio, src }) {
  const iframeRef = useRef(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) {
      return
    }

    let doc = iframe.document
    if (iframe.contentDocument) doc = iframe.contentDocument
    else if (iframe.contentWindow) doc = iframe.contentWindow.document

    const gistScript = `<script type="text/javascript" src="${src}"></script>`
    const styles = '<style>*{font-size:12px;}</style>'
    const elementId = src.replace('https://gist.github.com/', '')
    const resizeScript = `onload="parent.document.getElementById('${elementId}').style.height=document.body.scrollHeight + 'px'"`
    const iframeHtml = `<html><head><base target="_parent">${styles}</head><body ${resizeScript}>${gistScript}</body></html>`

    doc.open()
    doc.writeln(iframeHtml)
    doc.close()
  }, [iframeRef])

  if (src && src.match(/^https:\/\/gist.github.com/)) {
    return (
      <div className="embed-auto-height">
        <iframe
          id={src.replace('https://gist.github.com/', '')}
          ref={iframeRef}
          width="100%"
          allowFullScreen
          frameBorder={0}
        />
      </div>
    )
  }

  return (
    <div className="embed">
      <img
        aria-hidden
        alt="image to preserve aspect ratio of the iframe"
        src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 ${(
          100 * aspectRatio
        ).toFixed(2)}'%3E%3C/svg%3E`}
      />
      <iframe src={src} allowFullScreen frameBorder={0} />
    </div>
  )
}

export default Embed
