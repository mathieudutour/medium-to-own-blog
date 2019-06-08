module.exports = {
  // the name of your website
  title: '{{ authorName }}',
  // the description of the website (eg. what shows on Google)
  description: "{{ authorName }}'s blog",
  // a short bio shown at the bottom of your blog posts
  // It should complete the sentence: Written by {{ authorName }} ...
  shortBio: '',
  // a longer bio showing on the landing page of the blog
  bio: `{{ bio }}`,
  author: '{{ authorName }}',
  githubUrl: '{{ githubURL }}',
  // replace this by the url where your website will be published
  siteUrl: 'http://localhost:8000',
  social: {
    // leave the social media you do not want to appear as empty strings
    twitter: '{{ twitterUsername }}',
    medium: '@{{ mediumUsername }}',
    facebook: '{{ facebookUsername }}',
    github: '',
    linkedin: '',
    instagram: '',
  },
}
