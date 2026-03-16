/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates an admonition component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} [properties.title] - An optional title.
 * @param {('tip'|'note'|'important'|'caution'|'warning')} type - The admonition type.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created admonition component.
 */
export function AdmonitionComponent(properties, children, type) {
	if (!Array.isArray(children) || children.length === 0)
		return h(
			"div",
			{ class: "hidden" },
			'Invalid admonition directive. (Admonition directives must be of block type ":::note{name="name"} <content> :::")',
		);

	let label = null;
	let contentChildren = children;
	if (properties?.["has-directive-label"]) {
		label = children[0];
		contentChildren = children.slice(1);
		if (label && typeof label === "object") {
			label.tagName = "span";
		}
	}

	let title = type.toUpperCase();
	if (properties?.title) {
		title = properties.title;
	} else if (label) {
		title = label;
	}

	return h("blockquote", { class: `admonition bdm-${type}` }, [
		h("span", { class: "bdm-title" }, label ? label : title),
		...contentChildren,
	]);
}
