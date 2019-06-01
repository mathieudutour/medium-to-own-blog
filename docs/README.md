# Guides

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

4. After the `---`, you can write any markdown.
5. You can add this file using the editor on GitHub.com which also has a Preview tab.

## Updating an article

1. Go to the existing file that was created in the `content` folder.
2. Inside the folder, go to the `index.md` file.
3. Inside the file, you can update the existing using the frontmatter syntax:

## Tasks

- [ ] how to use git to publish the blog
- [x] how to create an article
- [ ] how to update an article
- [ ] draft/published
- [ ] canonical link
- [ ] add analytics for your blog
- [ ] add a mailing list to your blog
