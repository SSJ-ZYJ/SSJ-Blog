import type { SearchResult } from "./types/data";

declare global {
	interface Window {
		swup: import("@swup/astro").AstroIntegration;
		pagefind: {
			search: (query: string) => Promise<{
				results: Array<{
					data: () => Promise<SearchResult>;
				}>;
			}>;
		};
	}

	namespace JSX {
		interface IntrinsicAttributes {
			"client:load"?: boolean;
			"client:visible"?: boolean;
			"client:idle"?: boolean;
			"client:media"?: string;
			"client:only"?: string;
		}
	}

	const __GIT_COMMIT_HASH__: string;
	const __GIT_BUILD_DATE__: string;
}
