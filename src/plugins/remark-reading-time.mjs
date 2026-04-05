// biome-ignore lint/suspicious/noShadowRestrictedNames: <toString from mdast-util-to-string>
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

const WORDS_PER_MINUTE = 150;

export function remarkReadingTime() {
	return (tree, { data }) => {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage, {
			wordsPerMinute: WORDS_PER_MINUTE,
		});
		data.astro.frontmatter.minutes = Math.max(
			1,
			Math.round(readingTime.minutes),
		);
		data.astro.frontmatter.words = readingTime.words;
	};
}
