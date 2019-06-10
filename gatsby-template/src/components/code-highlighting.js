import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'

const preToCodeBlock = preProps => {
  if (
    // children is MDXTag
    preProps.children &&
    // MDXTag props
    preProps.children.props &&
    // if MDXTag is going to render a <code>
    preProps.children.props.name === 'code'
  ) {
    // we have a <pre><code> situation
    const {
      children: codeString,
      props: { className, ...props },
    } = preProps.children.props

    return {
      codeString: codeString.trim(),
      language: className && className.split('-')[1],
      ...props,
    }
  }
  if (preProps.children && typeof preProps.children === 'string') {
    const { children, className, ...props } = preProps
    return {
      codeString: children.trim(),
      language: className && className.split('-')[1],
      ...props,
    }
  }
  return undefined
}

const theme = {
  plain: {
    color: 'rgba(0, 0, 0, 0.84)',
    backgroundColor: 'rgb(243, 243, 243)',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#999988',
        fontStyle: 'italic',
      },
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ['string', 'attr-value'],
      style: {
        color: '#e3116c',
      },
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: '#393A34',
      },
    },
    {
      types: [
        'entity',
        'url',
        'symbol',
        'number',
        'boolean',
        'variable',
        'constant',
        'property',
        'regex',
        'inserted',
      ],
      style: {
        color: '#36acaa',
      },
    },
    {
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: {
        color: '#00a4db',
      },
    },
    {
      types: ['function', 'deleted', 'tag'],
      style: {
        color: '#d73a49',
      },
    },
    {
      types: ['function-variable'],
      style: {
        color: '#6f42c1',
      },
    },
    {
      types: ['tag', 'selector', 'keyword'],
      style: {
        color: '#00009f',
      },
    },
  ],
}

const InlineCode = ({ codeString, language /* , ...props */ }) => {
  return (
    <Highlight
      {...defaultProps}
      code={codeString}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <code className={className} style={style}>
          {tokens.map((line, i) => (
            <span {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </span>
          ))}
        </code>
      )}
    </Highlight>
  )
}

const Code = ({ codeString, language /* , ...props */ }) => {
  return (
    <Highlight
      {...defaultProps}
      code={codeString}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </div>
      )}
    </Highlight>
  )
}

export const PrismjsReplacement = preProps => {
  const props = preToCodeBlock(preProps)
  // if there's a codeString and some props, we passed the test
  if (props) {
    return <Code {...props} />
  }
  // it's possible to have a pre without a code in it
  return <pre {...preProps} />
}

export const PrismjsReplacementInline = preProps => {
  const props = preToCodeBlock(preProps)
  // if there's a codeString and some props, we passed the test
  if (props) {
    return <InlineCode {...props} />
  }
  // it's possible to have a pre without a code in it
  return <code {...preProps} />
}
