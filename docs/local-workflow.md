# Working locally on your blog

To work on your blog locally, run the following commands:

```bash
npm install
npm start
```

You can then visit [http://localhost:8000/](http://localhost:8000/) to view the blog. Any edit made to the content of the blog will automatically be reflected there.

## Creating an article

1. Create a new folder in the `content` folder. The name of the folder will be the url of the post.
2. Inside the newly created folder, create a `index.md` file.
3. Inside the file, you can specify some metadata for the post using the frontmatter syntax:

   ```md
   ---
   title: 'Title of the article'
   description: 'a short description that will show up in the front page of the blog and in the google description'
   date: 'date of the publication, you can leave empty until you publish it'
   categories:
     - tag
     - of
     - the
     - article
   published: `true` or `false` (if false, you can access the article via its url but it won't show up in the front page)
   ---
   ```

4. All content after the `---` will be treated as the article body. You can edit the content in different ways:
   1. Use any text editor to write markdown.
   2. Use this medium-like editor [tool](https://ionicabizau.github.io/medium-editor-markdown/example/) to generate the markdown for you and then copy/paste the markdown into the file.

_Alternatively, you can add this file using the editor on GitHub.com which also has a Preview tab._

## Updating an article

To update an article, update the content of `content/url-of-the-article/index.md` file.

## Deleting an article

To delete an article, delete the `content/url-of-the-article` folder.

## Publishing the changes

To publish the local changes, you need to use git.

Open a terminal and run the following commands

```bash
git add .
git commit -m 'publish changes'
git push
```

Netlify will automatically pick up the changes and deploy them. Wait a couple of minutes and the changes will be live!
