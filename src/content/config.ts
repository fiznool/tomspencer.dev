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

const experience = defineCollection({
  schema: z.object({
    role: z.string(),
    company: z.object({
      name: z.string(),
      url: z.string().optional(),
    }),
    startDate: z.date(),
    endDate: z.date().optional(),
    order: z.number(),
  }),
});

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    keyPoints: z.array(z.string()),
    startDate: z.date(),
    endDate: z.date().optional(),
    clientSite: z.string().optional(),
    featured: z.boolean().optional(),
    cv: z.boolean().optional(),
    faction: z.enum(['frontend', 'backend', 'fullstack', 'mobile-app']),
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

export const collections = { blog, experience, projects, testimonials };
