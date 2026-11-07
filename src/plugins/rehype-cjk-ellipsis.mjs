import { visit } from "unist-util-visit";

/* LXGW WenKai derives from the Japanese font Klee One, which draws the
   ellipsis near the middle of the line. Chinese typography expects the dots
   on the baseline, so wrap ellipsis runs in a span that CSS can shift down. */
const SKIP_TAGS = new Set([
	"code",
	"pre",
	"kbd",
	"samp",
	"script",
	"style",
	"textarea",
	"math",
]);

const SKIP_CLASSES = new Set([
	"cjk-ellipsis",
	"katex",
	"katex-display",
	"katex-html",
	"mermaid",
]);

function isSkipped(node) {
	if (SKIP_TAGS.has(node.tagName)) return true;
	const className = node.properties?.className;
	if (typeof className === "string") return SKIP_CLASSES.has(className);
	if (Array.isArray(className))
		return className.some((c) => SKIP_CLASSES.has(c));
	return false;
}

function splitEllipsis(value) {
	return value
		.split(/(…+)/)
		.filter(Boolean)
		.map((part) =>
			part.startsWith("…")
				? {
						type: "element",
						tagName: "span",
						properties: { className: ["cjk-ellipsis"] },
						children: [{ type: "text", value: part }],
					}
				: { type: "text", value: part },
		);
}

export function rehypeCjkEllipsis() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (isSkipped(node)) return "skip";

			const children = node.children;
			if (
				!children?.some(
					(child) => child.type === "text" && child.value.includes("…"),
				)
			) {
				return;
			}

			node.children = children.flatMap((child) =>
				child.type === "text" && child.value.includes("…")
					? splitEllipsis(child.value)
					: [child],
			);
		});
	};
}
