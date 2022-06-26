/*
 * Creates {@link HTMLElement} `<a>` with given text and link
 *
 * @param doc - root {@link HTMLElement} for creating another one
 * @param text - text inside the `<a>`
 * @param link - link to be placed in `href`
 *
 * @returns `<a>` elements with given params
 */
import {MarkdownRenderer, Notice} from "obsidian";
import {getAuthorsCode, Quote, searchQuote} from "../types/quote";
import {getBlockMetadataIdx} from "./scan";
import LocalQuotes from "../main";

export function createDomLink(doc: HTMLElement, text: string, link: string): HTMLElement {
	let a: HTMLAnchorElement = doc.createEl('a');
	a.appendText(text);
	a.href = link;

	return a;
}

export async function handlePossibleButtonClick(plugin: LocalQuotes, ev: MouseEvent): Promise<void> {
	const htmlEl = <HTMLElement>ev.target;
	if (htmlEl.matches('.block-language-localquote svg'))
		await refreshButtonAction(plugin, htmlEl);
}

async function refreshButtonAction(plugin: LocalQuotes, el: HTMLElement): Promise<void> {
	const blockChild = plugin.settings.usePlainFormat ? 'div' : 'blockquote';

	const bq = el.parentElement.find(blockChild)
	const id = bq.getAttr('local-quote-id');

	const bmIdx = getBlockMetadataIdx(plugin, id);

	plugin.settings.blockMetadata[bmIdx].content = searchQuote(
		plugin.settings.quoteVault,
		plugin.settings.blockMetadata[bmIdx].search,
		plugin.settings.useWeightedRandom
	);

	const blockMetadata = plugin.settings.blockMetadata[bmIdx];

	bq.innerHTML = '';

	// Update current view
	for (let p of plugin.settings.quoteBlockFormat.split('\n')) {
		await MarkdownRenderer.renderMarkdown(
			p.replace('{{content}}', blockMetadata.content.text.split('\n').join('<br/>'))
				.replace('{{author}}', plugin.settings.inheritListingStyle
					? getAuthorsCode(plugin.settings.quoteVault, blockMetadata.content.author)
					: blockMetadata.content.author),
			bq, '?no-dataview', null
		);
	}
}
