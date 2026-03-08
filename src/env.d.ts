/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare namespace astroHTML.JSX {
	interface HTMLAttributes {
		"client:load"?: boolean;
		"client:visible"?: boolean;
		"client:idle"?: boolean;
		"client:media"?: string;
		"client:only"?: string;
	}
}
