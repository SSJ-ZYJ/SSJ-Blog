import { render } from "astro:content";
import { getSortedPosts } from "./content-utils";

export interface SiteStats {
	postCount: number;
	totalWords: number;
}

export async function getSiteStats(): Promise<SiteStats> {
	const posts = await getSortedPosts();
	const postCount = posts.length;

	let totalWords = 0;
	for (const post of posts) {
		const { remarkPluginFrontmatter } = await render(post);
		totalWords += remarkPluginFrontmatter.words || 0;
	}

	return { postCount, totalWords };
}

export function formatNumber(num: number): string {
	if (num >= 10000) {
		return (num / 10000).toFixed(1) + "w";
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + "k";
	}
	return num.toString();
}
