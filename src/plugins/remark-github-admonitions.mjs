import { visit } from "unist-util-visit";

const GITHUB_ALERT_TYPES = [
	"NOTE",
	"TIP",
	"IMPORTANT",
	"WARNING",
	"CAUTION",
	"INFO",
];
const GITHUB_ALERT_DECLARATION_REGEX = /^\s*\[!(?<type>\w+)\]\s*(?<title>.*)$/;

function isGithubAlertType(type) {
	return GITHUB_ALERT_TYPES.includes(type?.toUpperCase());
}

function mapGithubAlertTypeToDirectiveName(type) {
	const typeMap = {
		NOTE: "note",
		TIP: "tip",
		IMPORTANT: "important",
		WARNING: "warning",
		CAUTION: "caution",
		INFO: "info",
	};
	return typeMap[type?.toUpperCase()] || type?.toLowerCase();
}

function parseGithubAlertDeclaration(text) {
	const match = text.match(GITHUB_ALERT_DECLARATION_REGEX);
	const type = match?.groups?.type;
	const title = match?.groups?.title?.trim() || null;
	return isGithubAlertType(type) ? { type, title } : null;
}

function parseGithubAlertBlockquote(node) {
	const [firstChild, ...blockQuoteChildren] = node.children;
	if (firstChild?.type !== "paragraph") return null;

	const [firstParagraphChild, ...paragraphChildren] = firstChild.children;

	let parsed = null;
	let textNodeChildren = [];
	let alertParagraphChildren = [];
	let remainingParagraphChildren = paragraphChildren;

	if (firstParagraphChild?.type === "text") {
		const [possibleTypeDeclaration, ...textNodes] =
			firstParagraphChild.value.split("\n");
		if (possibleTypeDeclaration === undefined) return null;

		parsed = parseGithubAlertDeclaration(possibleTypeDeclaration);
		if (parsed === null) return null;

		textNodeChildren =
			textNodes.length > 0
				? [{ type: "text", value: textNodes.join("\n") }]
				: [];
	} else if (firstParagraphChild?.type === "linkReference") {
		const identifier = firstParagraphChild.identifier;
		if (!identifier || !identifier.startsWith("!")) return null;

		const type = identifier.substring(1);
		if (!isGithubAlertType(type)) return null;

		let title = null;
		let contentParagraphChildren = [...paragraphChildren];

		if (
			firstParagraphChild.children &&
			firstParagraphChild.children.length > 0
		) {
			const linkChildren = firstParagraphChild.children;
			if (linkChildren[0]?.type === "text") {
				title = linkChildren[0].value?.trim() || null;
			}
		}

		if (
			!title &&
			paragraphChildren.length > 0 &&
			paragraphChildren[0]?.type === "text"
		) {
			title = paragraphChildren[0].value?.trim() || null;
			contentParagraphChildren = paragraphChildren.slice(1);
		}

		parsed = { type, title };
		remainingParagraphChildren = contentParagraphChildren;
	} else {
		return null;
	}

	const { type, title } = parsed;

	// Remove leading break nodes from remainingParagraphChildren
	// These are caused by trailing spaces (hard line breaks) after the title
	while (
		remainingParagraphChildren.length > 0 &&
		remainingParagraphChildren[0]?.type === "break"
	) {
		remainingParagraphChildren = remainingParagraphChildren.slice(1);
	}

	// Also remove leading break nodes from textNodeChildren if they exist
	if (
		textNodeChildren.length > 0 &&
		textNodeChildren[0]?.type === "text" &&
		textNodeChildren[0].value
	) {
		// Trim leading newlines/whitespace from the text value
		textNodeChildren[0].value = textNodeChildren[0].value.replace(/^\s+/, "");
		if (textNodeChildren[0].value === "") {
			textNodeChildren = [];
		}
	}

	const hasParagraphChildren =
		textNodeChildren.length > 0 || remainingParagraphChildren.length > 0;

	alertParagraphChildren = hasParagraphChildren
		? [
				{
					type: "paragraph",
					children: [...textNodeChildren, ...remainingParagraphChildren],
				},
			]
		: [];

	return {
		type,
		title,
		children: [...alertParagraphChildren, ...blockQuoteChildren],
	};
}

export function remarkGithubAdmonitionsToDirectives() {
	return (tree) => {
		visit(tree, "blockquote", (node, index, parent) => {
			const githubAlert = parseGithubAlertBlockquote(node);
			if (githubAlert === null) return;

			const directiveName = mapGithubAlertTypeToDirectiveName(githubAlert.type);

			const directive = {
				type: "containerDirective",
				name: directiveName,
				children: githubAlert.children,
				attributes: {},
			};

			if (githubAlert.title) {
				directive.attributes.title = githubAlert.title;
			}

			if (parent === undefined || index === undefined) return;
			parent.children[index] = directive;
		});
	};
}
