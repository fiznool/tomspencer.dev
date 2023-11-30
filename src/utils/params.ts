import type { CollectionEntry } from 'astro:content';

export function getBlogParams(post: CollectionEntry<'blog'>) {
  const pubDate = post.data.pubDate;

  const pubYear = String(pubDate.getFullYear()).padStart(4, '0');
  const pubMonth = String(pubDate.getMonth() + 1).padStart(2, '0');
  const pubDay = String(pubDate.getDate()).padStart(2, '0');

  const slug =
    (post.slug.match(/\d{4}-\d{2}-\d{2}-(.+)/) || [])[1] || post.slug;
  const path = `${pubYear}/${pubMonth}/${pubDay}/${slug}`;

  return {
    year: pubYear,
    month: pubMonth,
    day: pubDay,
    path,
    slug,
  };
}
