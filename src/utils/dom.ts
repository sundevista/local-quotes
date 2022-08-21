import {MarkdownRenderer, MarkdownView} from "obsidian";
import {QuotesMap, searchQuote} from "../types/quote";
import {getBlockMetadataIdx} from "./scan";
import LocalQuotes from "../main";
import {LocalQuotesSettings} from "../settings";
import {BlockMetadata} from "../types/block-metadata";
import {OneTimeBlock} from "../types/one-time-block";
import {formQuotesMap} from "../processors/code-block";
import {getAuthorsCode} from "./quoteVault";

/*
 * Creates {@link HTMLElement} `<a>` with given text and link
 *
 * @param doc - root {@link HTMLElement} for creating another one
 * @param text - text inside the `<a>`
 * @param link - link to be placed in `href`
 *
 * @returns `<a>` elements with given params
 */
export function createDomLink(doc: HTMLElement, text: string, link: string): HTMLElement {
	let a: HTMLAnchorElement = doc.createEl('a');
	a.appendText(text);
	a.href = link;

	return a;
}

export async function handlePossibleButtonClick(plugin: LocalQuotes, ev: MouseEvent): Promise<void> {
	const htmlEl = <HTMLElement>ev.target;
	const caughtButtonClick = htmlEl.matches('.block-language-localquote svg') && ev.type === 'click';
	const caughtDoubleClick = htmlEl.matchParent('.block-language-localquote') && ev.type === 'dblclick'
		&& plugin.settings.enableDblClick && htmlEl.matchParent('.is-mobile');

	if (caughtButtonClick || caughtDoubleClick) {
		await refreshButtonAction(plugin, <HTMLElement>htmlEl.matchParent('.block-language-localquote'));
	}
}

export async function renderQuoteBlock(
	pluginSettings: LocalQuotesSettings,
	el: HTMLElement,
	blockMetadata: BlockMetadata|OneTimeBlock
): Promise<void> {
	if (el.innerHTML != '' || el.innerHTML != null) el.innerHTML = '';

	for (let p of pluginSettings.quoteBlockFormat.split('\n')) {
		await MarkdownRenderer.renderMarkdown(
			p.replace('{{content}}', blockMetadata.content.text.split('\n').join('<br/>'))
				.replace('{{author}}', pluginSettings.inheritListingStyle
					? getAuthorsCode(pluginSettings.quoteVault, blockMetadata.content.author)
					: blockMetadata.content.author),
			el, '?no-dataview', null
		);
	}
}

async function refreshButtonAction(plugin: LocalQuotes, el: HTMLElement): Promise<void> {
	const mdView = app.workspace.getActiveViewOfType(MarkdownView);
	const blockChild = plugin.settings.usePlainFormat ? 'div' : 'blockquote';

	let bq = el.find(blockChild);
	const id = bq.getAttr('local-quote-id');

	if (id != null) {
		const bmIdx = getBlockMetadataIdx(plugin, id);

		plugin.settings.blockMetadata[bmIdx].content = searchQuote(
			plugin.settings.quoteVault,
			plugin.settings.blockMetadata[bmIdx].search,
			plugin.settings.useWeightedRandom
		);

		await plugin.saveSettings();

		await rerenderAllQuotesForView(plugin, mdView);
	}
}

export async function rerenderAllQuotesForView(
	plugin: LocalQuotes,
	mdView: MarkdownView,
	quotesMap: QuotesMap = null
): Promise<void> {
	if (quotesMap == null) quotesMap = formQuotesMap(plugin.settings, mdView);

	for (const id of quotesMap.keys()) {
		const blockMetadata = plugin.settings.blockMetadata[getBlockMetadataIdx(plugin, id)];
		for (const el of quotesMap.get(id)) await renderQuoteBlock(plugin.settings, el, blockMetadata);
	}
}

export async function refreshAllQuotesForView(plugin: LocalQuotes, mdView: MarkdownView): Promise<void> {
	const quotesMap = formQuotesMap(plugin.settings, mdView);

	for (const id of quotesMap.keys()) {
		const bmIdx = getBlockMetadataIdx(plugin, id);

		// Update blockMetadata
		plugin.settings.blockMetadata[bmIdx].content = searchQuote(
			plugin.settings.quoteVault,
			plugin.settings.blockMetadata[bmIdx].search,
			plugin.settings.useWeightedRandom
		);
	}

	await plugin.saveSettings();

	await rerenderAllQuotesForView(plugin, mdView, quotesMap);
}
