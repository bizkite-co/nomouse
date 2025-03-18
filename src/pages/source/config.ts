// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const websitesCollection = defineCollection({
  type: 'content', // Important: 'content' for Markdown/MDX
  schema: z.object({
    title: z.string(),
    description: z.string().optional(), // Make description optional
    url: z.string(),
    favicon: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()),
    lastReviewAt: z.string().or(z.date()), // Handle both string and date
    desktopSnapshot: z.string().optional(),
    uuid: z.string(),
  }),
});

export const collections = {
  'websites': websitesCollection,
};