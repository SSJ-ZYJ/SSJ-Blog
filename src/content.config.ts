import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const postsSchema = z.object({
	title: z.string(),
	published: z.date(),
	updated: z.date().optional(),
	draft: z.boolean().optional().default(false),
	description: z.string().optional().default(""),
	image: z.string().optional().default(""),
	tags: z.array(z.string()).optional().default([]),
	category: z.string().optional().nullable().default(""),
	lang: z.string().optional().default(""),

	prevTitle: z.string().default(""),
	prevSlug: z.string().default(""),
	nextTitle: z.string().default(""),
	nextSlug: z.string().default(""),
});

export interface PostData {
	title: string;
	published: Date;
	updated?: Date;
	draft?: boolean;
	description?: string;
	image?: string;
	tags?: string[];
	category?: string | null;
	lang?: string;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
}

export const collections = {
	posts: defineCollection({
		loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
		schema: postsSchema,
	}),
	spec: defineCollection({
		loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
		schema: z.object({}),
	}),
};
