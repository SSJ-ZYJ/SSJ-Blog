import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";

export type BackgroundConfig = {
	enable: boolean;
	src: string;
	position?: "top" | "center" | "bottom";
	size?: "cover" | "contain" | "auto";
	repeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
	attachment?: "fixed" | "scroll" | "local";
	opacity?: number;
	blur?: number;
};

export type SiteConfig = {
	title: string;
	subtitle: string;

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
	};
	banner: {
		enable: boolean;
		src: string;
		position?: "top" | "center" | "bottom";
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
	};
	background?: BackgroundConfig;
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};

	favicon: Favicon[];
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string | string[];
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof AUTO_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
};

export type GiscusConfig = {
	enable: boolean;
	repo: string;
	repoId: string;
	category: string;
	categoryId: string;
	mapping: "pathname" | "url" | "title" | "og:title" | "specific" | "number";
	strict: "0" | "1";
	reactionsEnabled: "0" | "1";
	emitMetadata: "0" | "1";
	inputPosition: "top" | "bottom";
	theme: string;
	lang: string;
	loading: "lazy" | "eager";
};
