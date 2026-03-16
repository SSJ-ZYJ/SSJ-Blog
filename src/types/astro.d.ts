declare global {
	namespace AstroJSX {
		interface AstroAttributes {
			"client:load"?: boolean;
			"client:visible"?: boolean;
			"client:idle"?: boolean;
			"client:media"?: string;
			"client:only"?: string;
		}
	}
}

export {};
