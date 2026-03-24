import { getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils";
import type { PostData } from "@/content.config";

function getSlugFromId(id: string): string {
	return id.replace(/\.(md|mdx)$/, "");
}

interface RawPost {
	id: string;
	body?: string;
	collection: "posts";
	data: PostData;
}

async function getRawSortedPosts(): Promise<RawPost[]> {
	const allBlogPosts = (await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	})) as RawPost[];

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

interface PostWithSlug extends RawPost {
	slug: string;
}

export async function getSortedPosts(): Promise<PostWithSlug[]> {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = getSlugFromId(sorted[i - 1].id);
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = getSlugFromId(sorted[i + 1].id);
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted.map((entry) => ({
		...entry,
		slug: getSlugFromId(entry.id),
	}));
}
export type PostForList = {
	slug: string;
	data: PostData;
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: getSlugFromId(post.id),
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = (await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	})) as RawPost[];

	const countMap: Record<string, number> = {};
	allBlogPosts.forEach((post) => {
		(post.data.tags ?? []).forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = (await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	})) as RawPost[];
	const count: Record<string, number> = {};
	allBlogPosts.forEach((post) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}
