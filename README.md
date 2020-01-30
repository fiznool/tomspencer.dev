# tomspencer.dev

## About

This is the source code for the site currently hosted at https://www.tomspencer.dev.

The code allows a static website to be generated using the [Hugo](https://gohugo.io) static site generator.

## Development

- `hugo new blog/YYYY-MM-DD-<kebab-case-post-name>.md`: create a new blog post. Name of post will be generated from the kebab-case name.
- `hugo server`: run a development server. Site will be available at http://localhost:1313.
- `hugo server -D`: as above but also previews draft posts.

## Deployment

The blog is hosted on Netlify. Push a commit to the master branch and the site will be automatically built and deployed.
