import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Card-font packages ship one stylesheet per weight that references 100-230
// separate woff2 files (CJK fonts are split by unicode-range). Letting Vite
// process those stylesheets makes it read every font at once, which exceeds the
// 1024-descriptor limit of EdgeOne's build container. Instead we copy the fonts
// into public/ and load them with plain <link> tags, so no bundler touches them.
const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const modules = path.join(projectRoot, "node_modules");
const outRoot = path.join(projectRoot, "public", "fonts");
const marker = path.join(outRoot, ".fingerprint");

const SOURCES = [
	{
		css: "@chinese-fonts/maple-mono-cn/dist/MapleMono-CN-Regular/result.css",
		dir: "maple-mono-cn/regular",
	},
	{
		css: "@chinese-fonts/maple-mono-cn/dist/MapleMono-CN-Bold/result.css",
		dir: "maple-mono-cn/bold",
	},
	{ css: "@fontsource/noto-sans/400.css", dir: "noto-sans" },
	{ css: "@fontsource/noto-sans/500.css", dir: "noto-sans" },
	{ css: "@fontsource/noto-sans/700.css", dir: "noto-sans" },
	{ css: "@fontsource/noto-sans-sc/400.css", dir: "noto-sans-sc" },
	{ css: "@fontsource/noto-sans-sc/500.css", dir: "noto-sans-sc" },
	{ css: "@fontsource/noto-sans-sc/700.css", dir: "noto-sans-sc" },
	{ css: "@fontsource/lxgw-wenkai/index.css", dir: "lxgw-wenkai" },
];

const URL_RE = /url\(\s*["']?\.\/([^"')]+)["']?\s*\)/g;

// Fontsource stylesheets also list a legacy .woff fallback next to every woff2.
// Every browser in use supports woff2, and dropping it halves the payload.
const WOFF_FALLBACK =
	/,\s*url\(\s*["']?\.\/[^"')]+\.woff["']?\s*\)\s*format\(\s*["']woff["']\s*\)/g;

const FORMAT_VERSION = 2;

function fingerprint() {
	return [
		FORMAT_VERSION,
		...SOURCES.map(({ css }) => {
			const file = path.join(modules, css);
			return fs.existsSync(file)
				? `${css}:${fs.statSync(file).mtimeMs}`
				: `${css}:missing`;
		}),
	].join("|");
}

export function syncFonts() {
	const current = fingerprint();
	if (fs.existsSync(marker) && fs.readFileSync(marker, "utf8") === current) {
		return;
	}

	fs.rmSync(outRoot, { recursive: true, force: true });

	for (const { css, dir } of SOURCES) {
		const cssPath = path.join(modules, css);
		if (!fs.existsSync(cssPath)) continue;

		const outDir = path.join(outRoot, dir);
		fs.mkdirSync(outDir, { recursive: true });

		const cssText = fs
			.readFileSync(cssPath, "utf8")
			.replace(WOFF_FALLBACK, "");
		fs.writeFileSync(path.join(outDir, path.basename(css)), cssText);

		for (const [, relative] of cssText.matchAll(URL_RE)) {
			const from = path.join(path.dirname(cssPath), relative);
			if (!fs.existsSync(from)) continue;
			const to = path.join(outDir, relative);
			fs.mkdirSync(path.dirname(to), { recursive: true });
			fs.copyFileSync(from, to);
		}
	}

	fs.writeFileSync(marker, current);
}