import { visit } from "unist-util-visit";

const GITHUB_ALERT_TYPES = ["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"];
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
	if (firstParagraphChild?.type !== "text") return null;

	const [possibleTypeDeclaration, ...textNodes] =
		firstParagraphChild.value.split("\n");
	if (possibleTypeDeclaration === undefined) return null;

	const parsed = parseGithubAlertDeclaration(possibleTypeDeclaration);
	if (parsed === null) return null;

	const { type, title } = parsed;

	const textNodeChildren =
		textNodes.length > 0 ? [{ type: "text", value: textNodes.join("\n") }] : [];
	const hasParagraphChildren =
		textNodeChildren.length > 0 || paragraphChildren.length > 0;

	const alertParagraphChildren = hasParagraphChildren
		? [
				{
					type: "paragraph",
					children: [...textNodeChildren, ...paragraphChildren],
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
