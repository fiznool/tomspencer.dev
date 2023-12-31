import { defineCollection, z } from 'astro:content';

const about = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
  }),
});

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // Transform string to Date object
    pubDate: z.string().transform((str) => new Date(str)),
    updatedDate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    heroImage: z.string().optional(),
    comments: z.boolean().optional(),
  }),
});

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    startDate: z.string() /*.transform((str) => new Date(str))*/,
    endDate: z
      .string()
      /* .transform((str) => new Date(str)) */
      .optional(),
    faction: z.array(z.enum(['frontend', 'backend', 'mobile-app'])),
  }),
});

export const collections = { about, blog, projects };
