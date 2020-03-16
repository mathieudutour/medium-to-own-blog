const colors = {
  text: 'rgba(0, 0, 0, 0.84)',
  muted: 'rgba(0, 0, 0, 0.68)',
  grey: 'rgba(0, 0, 0, 0.54)',
  background: '#ffffff',
  codeBackground: 'rgb(243, 243, 243)',
  primary: 'lavender',
  boxShadow: 'rgba(0, 0, 0, 0.04)',
  separator: 'rgba(0, 0, 0, 0.09)',
  categories: {
    // the background colors of post's categories
  },
}

const fonts = {
  sansSerif:
    "-apple-system, BlinkMacSystemFont, Avenir, 'Avenir Next', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  monospace:
    "'SFMono-Regular', Menlo, Monaco, 'Courier New', Courier, monospace",
}

const shadows = {
  box: `0 1px 4px ${colors.boxShadow}`,
}

module.exports = {
  colors,
  fonts,
  shadows,
  highlighting: {
    plain: {
      color: colors.text,
      backgroundColor: colors.codeBackground,
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
  },
}
