import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import Embed from './embed'

// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => (
  <MDXProvider components={{ Embed }}>{element}</MDXProvider>
)
