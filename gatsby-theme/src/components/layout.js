import React from 'react'
import { Global } from '@emotion/core'

import theme from '../theme'

const Layout = ({ children }) => (
  <main>
    <Global
      styles={`
        body,
        html {
          margin: 0;
          padding: 0;
        }

        html {
          box-sizing: border-box;
          font-size: 62.5%;
          background: ${theme.colors.background};
        }

        body {
          margin: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;

          line-height: 1.6;
          font-size: 2.1rem;
          font-weight: 400;
          font-family: ${theme.fonts.sansSerif};
          height: 100%;
          background: ${theme.colors.background};

          color: ${theme.colors.text};
          text-rendering: optimizeLegibility;
        }

        h1,
        h2,
        p,
        i,
        a {
          color: ${theme.colors.text};
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          line-height: 1.1;
        }

        h1 {
          font-size: 48px;
          text-align: left;
          margin-bottom: 8px;
        }

        h2 {
          font-size: 26px;
          font-weight: 700;
          padding: 0;
          margin: 56px 0 -13px -1.883px;
          text-align: left;
          line-height: 34.5px;
          letter-spacing: -0.45px;
        }

        p,
        i,
        a {
          margin-top: 21px;
          font-size: 21px;
          letter-spacing: -0.03px;
          line-height: 1.58;
        }

        a {
          text-decoration: underline;
        }

        blockquote {
          font-size: 30px;
          font-style: italic;
          letter-spacing: -0.36px;
          line-height: 44.4px;
          overflow-wrap: break-word;
          margin: 55px 0 33px 0;
          color: ${theme.colors.muted};
          border-left: 3px solid ${theme.colors.text};
          padding-left: 20px;
          margin-left: -23px;
          padding-bottom: 2px;
        }

        blockquote p:last-child {
          margin-bottom: 0;
        }

        pre,
        code {
          font-size: 16px;
          background: ${theme.colors.codeBackground};
          font-family: ${theme.fonts.monospace};
        }

        code {
          padding: 3px 4px;
          margin: 0 2px;
        }

        pre {
          overflow-x: auto;
          padding: 20px;
        }

        pre code {
          padding: 0;
          margin: 0;
        }

        mark {
          background: ${theme.colors.primary};
        }

        ::selection {
          background-color: ${theme.colors.primary};
        }

        img {
          max-width: 100%;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          position: relative;
        }
        .anchor {
          position: absolute;
          left: -30px;
          opacity: 0;
          width: 30px;
        }

        h1:hover .anchor,
        h2:hover .anchor,
        h3:hover .anchor,
        h4:hover .anchor,
        h5:hover .anchor,
        h6:hover .anchor {
          opacity: 1;
        }

        h1 .anchor {
          margin-top: 21px;
        }
        h3 .anchor {
          margin-top: 5px;
        }
        h4 .anchor {
          margin-top: 2px;
        }

        figcaption {
          width: 100%;
          margin-top: 10px;
          line-height: 1.4;
          color: ${theme.colors.muted};
          letter-spacing: 0;
          text-align: center;
          font-size: 14px;
        }
      `}
    />
    {children}
  </main>
)

export default Layout
