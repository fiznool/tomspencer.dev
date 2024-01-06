import { defineCollection, z } from 'astro:content';

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
    clientSite: z.string().optional(),
    featured: z.boolean().optional(),
    faction: z.array(z.enum(['frontend', 'backend', 'mobile-app'])),
  }),
});

const testimonials = defineCollection({
  schema: z.object({
    contact: z.object({
      name: z.string(),
      role: z.string(),
      avatar: z.string().optional(),
    }),
    company: z.object({
      name: z.string(),
      url: z.string().optional(),
    }),
  }),
});

export const collections = { blog, projects, testimonials };
