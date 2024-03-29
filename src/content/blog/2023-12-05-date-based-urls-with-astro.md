---
categories:
comments: true
description: Astro does not provide an out-of-the-box configuration for a date-based URL hierarchy, but with a few small tweaks, this can be achieved.
pubDate: '2023-12-05T11:28:10.057Z'
title: 'Date-based URLs with Astro'
---

When migrating my site from Hugo to [Astro](https://astro.build/), the process was mostly seamless. However, configuring blog post URLs, or permalinks, proved to be a bit challenging.

This blog uses a date-based hierarchy for its URLs. This post, for example, lives at [/blog/2023/12/05/date-based-urls-with-astro/](/blog/2023/12/05/date-based-urls-with-astro/). Configuring this with Hugo was straightforward, by [modifying the `permalinks` site configuration](https://gohugo.io/content-management/urls/#permalinks).

Unlike Hugo, Astro doesn't offer a straightforward way to set up a date-based URL hierarchy out of the box. The default behaviour relies on file-based routing, where the filename becomes the URL. For my blog, which follows a date-based hierarchy like `/blog/2023/12/05/date-based-urls-with-astro/`, this posed an issue - all existing content would be rendered with a different permalink, meaning that any old links would no longer work.

Three options were explored to address this:

1. **Renaming Existing Content:** This would involve changing filenames to match the desired structure, for example moving `2023-12-05-date-based-urls-with-astro.md` to `2023/12/05/date-based-urls-with-astro.md`. This wasn't ideal as it disrupted the flat folder structure.
2. **Redirecting to new permalinks:** While feasible, I preferred to stick with the date-based URL hierarchy for aesthetic reasons.
3. **Overriding Astro's URL Generation:** This option allowed me to align with the desired structure without changing existing content filenames.

I chose option 3, overriding Astro's URL generation method. To implement this, I made modifications to Astro's [default blog site template](https://github.com/fiznool/astro-blog-custom-path/tree/76f22162556ba7d08cd084d4374c527d7078bd74).

## Overriding Astro's URL generation method

Astro splits content and rendering, simplifying content authoring without worrying about the final HTML output.

- Content resides in `src/content`, organized in 'collection' directories.
- Page templates are in `src/pages`, following file-based routing.
- HTML files are generated by rendering content with a page template.

Astro's [default blog site template](https://github.com/fiznool/astro-blog-custom-path/tree/76f22162556ba7d08cd084d4374c527d7078bd74) contains templates for the index (list) of posts and the individual post itself. To accommodate the date-based hierarchy, we need to modify the templates for both pages.

### Date token generation

A new function was created to parse the `pubDate` from the article's frontmatter, returning individual tokens for use by the page templates:

```ts
// src/utils/params.ts
import type { CollectionEntry } from 'astro:content';

export function getBlogParams(post: CollectionEntry<'blog'>) {
  // Grab the `pubDate` from the blog post's frontmatter.
  // This will be of type `Date`, since the `CollectionEntry` of type 'blog'
  // defines the `pubDate` field as type 'Date'.
  const pubDate = post.data.pubDate;

  // Parse out the year, month and day from the `pubDate`.
  const pubYear = String(pubDate.getFullYear()).padStart(4, '0');
  const pubMonth = String(pubDate.getMonth() + 1).padStart(2, '0');
  const pubDay = String(pubDate.getDate()).padStart(2, '0');

  // Astro generates the `slug` from the filename of the content.
  // Our filenames begin with `YYYY-MM-DD-`, but we don't want this in our resulting URL.
  // So, we use a regex to remove this prefix, if it exists.
  const slug =
    (post.slug.match(/\d{4}-\d{2}-\d{2}-(.+)/) || [])[1] || post.slug;

  // Build our desired date-based path from the relevant parts.
  const path = `${pubYear}/${pubMonth}/${pubDay}/${slug}`;

  // Return each token so it can be used by calling code.
  return {
    year: pubYear,
    month: pubMonth,
    day: pubDay,
    path,
    slug,
  };
}
```

### Index page

The template for the index page, found at `src/pages/blog/index.astro`, was modified to generate correct links using this new function:

```astro
import { getCollection } from 'astro:content';

// Import the new function
import { getBlogParams } from '../../utils/params';

const posts = await getCollection('blog');

<!doctype html>
<html lang="en">
  <head><!-- Omitted for brevity --></head>
  <body>
    <main>
      <h1>Blog posts</h1>
      <ul>
        {
          posts.map(post => {
            // Use the new function to generate the desired path
            const { path } = getBlogParams(post);
            return (
              <li>
                <a href={`/blog/${path}/`}>
                  <h2 class="title">{post.data.title}</h4>
                </a>
              </li>
            );
          })
        }
      </ul>
    </main>
  </body>
</html>
```

### Individual Post Page

The individual post template was moved to a new folder structure, `src/pages/blog/[year]/[month]/[day]/[...slug].astro`, using dynamic route segments so that Astro's file-based routing would continue to generate the correct URLs.

The template was then modified with Astro's `getStaticPaths` method to correctly build the URL for each post:

```js
// src/pages/blog/[year]/[month]/[day]/[...slug].astro
export async function getStaticPaths() {
  // Fetch all the posts from the collection 'blog'
  const posts = await getCollection('blog');

  // Iterate over the posts, generating the tokens and
  // setting them inside the `params` key.
  // Astro will use anything inside `params` as the token
  // for a dynamic route segment.
  return posts.map((post) => ({
    params: getBlogParams(post),
    props: post,
  }));
}
```

These changes allow Astro to replace the dynamic route segments with the respective token from the `params` object, to build the URL correctly.

## Summary

In summary:

- A new function, `getBlogParams`, was created to parse `pubDate` from content frontmatter and generate the correct URL parts.
- This function was integrated into the index template to create the links for individual posts.
- The individual post template was relocated to a new structure to match the desired date-based hierarchy.
- The `getBlogParams` function was called in the individual post template to generate the correct URL path.

For a detailed view of these changes, refer to [this GitHub repo](https://github.com/fiznool/astro-blog-custom-path), particularly [this commit](https://github.com/fiznool/astro-blog-custom-path/commit/a989b0694eb74b978e9bfab78ddb672bae4df7ed).

Consider adopting this approach for rendering Astro content with a date-based hierarchy in your projects. It has worked well so far for me.
