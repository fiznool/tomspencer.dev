import { defineCollection, z } from 'astro:content'

const about = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
  }),
})

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // Transform string to Date object
    pubDate: z.string().transform((str) => new Date(str)),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    comments: z.boolean().optional(),
  }),
})

export const collections = { about, blog }
