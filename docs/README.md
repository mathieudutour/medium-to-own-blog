# Guides

## Working on your blog

You have different ways to update your blog. If you are familiar with a terminal and git, you might want to [work locally on your blog](./local-workflow.md). Otherwise you can enable the [online editor](./online-workflow.md) and use it.

## Using your own domain name

Check out [this article](https://css-tricks.com/using-your-domain-with-a-netlify-hosted-site/) which explains how to use your own domain name with a Netlify hosted site.

## Changing styles

`medium-to-own-blog` allows you to change the default theme styling by updating the theme values.

First, you must create a theme file and then you can override theme values. See all [theme values](../gatsby-theme/theme.js)

```js
// src/gatsby-theme-medium-to-own-blog/theme.js

import defaultTheme from 'gatsby-theme-medium-to-own-blog/src/theme'

export default {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    text: '#000',
    primary: '#6166DC',
    background: '#fff',
  },
}
```

## Component Shadowing

> This feature allows users to override a component in order to customize its rendering.
>
> Component Shadowing lets you replace the theme’s original file, gatsby-theme-medium-to-own-blog/src/components/bio.js for example, with your own to implement any changes you need.

Any component or section is able to be replaced with your own custom component.

This opens up a full customization of the blog to your designed needs. You can copy any component directly from `medium-to-own-blog` and alter it how you like, or you can create your own component to replace `medium-to-own-blog`'s entirely.

## Tasks

- [ ] draft/published
- [ ] canonical link
- [ ] add analytics for your blog
- [ ] add a mailing list to your blog
