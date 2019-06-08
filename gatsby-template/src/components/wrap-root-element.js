import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import Embed from './embed'
import {
  PrismjsReplacementInline,
  PrismjsReplacement,
} from './code-highlighting'

// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => (
  <MDXProvider
    components={{
      Embed,
      inlineCode: PrismjsReplacementInline,
      code: PrismjsReplacement,
    }}
  >
    {element}
  </MDXProvider>
)
