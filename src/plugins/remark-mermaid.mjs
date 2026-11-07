import { visit } from "unist-util-visit";

/* Convert ```mermaid code blocks into <pre class="mermaid"> elements so they
   are rendered client-side by mermaid instead of Expressive Code */
export function remarkMermaid() {
	return (tree) => {
		visit(tree, "code", (node, index, parent) => {
			if (node.lang !== "mermaid" || !parent) return;
			const escaped = node.value
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;");
			parent.children[index] = {
				type: "html",
				value: `<pre class="mermaid">${escaped}</pre>`,
			};
		});
	};
}
