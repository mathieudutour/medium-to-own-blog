# Medium to own blog

_Switch from Medium to your own blog in a few minutes._

[![demo](./docs/screencast.gif)](https://twitter.com/MathieuDutour/status/1134448154793914368)

## :rocket: QuickStart

_Requires [Node.js](https://nodejs.org/en/)_

```bash
npx medium-to-own-blog
```

## :link: Live Demo

Here's a [live demo](https://mathieudutour-blog.netlify.com).

## :muscle: Motivation

There is no shortage of explanations behind exiting Medium. Here is a few selection of articles:

- [https://m.signalvnoise.com/signal-v-noise-exits-medium/](https://m.signalvnoise.com/signal-v-noise-exits-medium/)
- [https://www.gautamdhameja.com/why-i-migrated-my-blog-from-medium/](https://www.gautamdhameja.com/why-i-migrated-my-blog-from-medium/)
- [https://baremetrics.com/blog/medium-back-to-blog](https://baremetrics.com/blog/medium-back-to-blog)

## :fire: Features

- Own your content
- Write using Markdown / [MDX](https://github.com/mdx-js/mdx)
- Syntax Highlighting using Prism
- Edit on Github
- Fully customizable
- Rich embeds using MDX
- Easy deployment: Deploy on Netlify / Now.sh / Docker
- SEO friendly
- :100: on the Performance, Accessibility, Best Practices, and SEO's [LightHouse tests](https://developers.google.com/web/tools/lighthouse/)

## :book: Documentation

Head over [here](./docs/README.md) to find a few guides to help you editing the content of your newly created blog.

## :pencil2: Contributing

Any idea on how to make the process easier or how to improve the generated blog? [Open a new issue](https://github.com/mathieudutour/medium-to-own-blog/issues/new)! We need all the help we can get to make this project awesome!

## :shell: Technical stack

This project is only possible thanks to the awesomeness of the following projects:

- [Gatsby](https://www.gatsbyjs.org/)
- [Markdown / MDX](https://github.com/mdx-js/mdx)
- [GitHub](https://github.com)
- [Netlify](https://netlify.com)

## :tm: License

MIT

## Migration Troubleshooting

Since everyone has different content in their Medium blogs, you might encounter some issues that can't be fixed in a standardized way or aren't worth trying. These issues and potential workarounds will be posted below:

- **JSX closing tag parsing error** - [Issue #56](https://github.com/mathieudutour/medium-to-own-blog/issues/56). You may have some self-closing, void tags in your blog posts. JSX requires all tags to be self-closed so even though the HTML break tag can be written as `<br>`, you will need to change the syntax to read `<br/>` or go back later after running the migration and place the tags in a code block.
- **GitHub authentication errors** - [Issue #54](https://github.com/mathieudutour/medium-to-own-blog/issues/54). GitHub allows users to set up authentication several different ways. For instance, if you have two-factor authentication enabled, you have to provide a token in certain cases when cloning down repositories. Please check your authentication settings if you experience any issues related to authentication failures.
