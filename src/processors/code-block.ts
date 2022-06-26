import LocalQuotes from '../main';
import { BlockMetadata, selectBlockMetadata } from '../types/block-metadata';
import {QuotesMap} from '../types/quote';
import { OneTimeBlock, selectOneTimeBlock } from '../types/one-time-block';
import {MarkdownPostProcessorContext, MarkdownView} from 'obsidian';
import {renderQuoteBlock} from "../utils/dom";
import {LocalQuotesSettings} from "../settings";

export async function processCodeBlock(
	plugin: LocalQuotes,
	source: string,
	el: HTMLElement): Promise<void> {
	const blockMetadata: BlockMetadata = await selectBlockMetadata(plugin, source);

	if (!plugin.settings.usePlainFormat) el.addClass('el-blockquote');
	if (blockMetadata.customClass !== null) el.addClass(blockMetadata.customClass);

	const bq: HTMLElement = el.createEl(plugin.settings.usePlainFormat ? 'div' : 'blockquote');

	el.appendChild(bq);
	bq.setAttribute('local-quote-id', blockMetadata.id);
	// @ts-ignore
	if (!plugin.settings.hideRefreshButton) el.createEl('svg', {cls: 'reset'});

	await renderQuoteBlock(plugin.settings, bq, blockMetadata);
}

export async function processOneTimeCodeBlock(
	plugin: LocalQuotes,
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext): Promise<void> {
	const oneTimeBlock: OneTimeBlock = await selectOneTimeBlock(plugin, source, ctx);

	if (!plugin.settings.usePlainFormat) el.addClass('el-blockquote');
	if (oneTimeBlock.customClass !== null) el.addClass(oneTimeBlock.customClass);

	const bq: HTMLElement = el.createEl(plugin.settings.usePlainFormat ? 'div' : 'blockquote');

	el.appendChild(bq);

	await renderQuoteBlock(plugin.settings, bq, oneTimeBlock);
}

export function formQuotesMap(pluginSettings: LocalQuotesSettings, mdView: MarkdownView): QuotesMap {
	const blockChild = pluginSettings.usePlainFormat ? 'div' : 'blockquote';

	let quotesMap = new Map<string,HTMLElement[]>();

	mdView.containerEl.findAll('.block-language-localquote ' + blockChild).forEach(e => {
		const id = e.getAttr('local-quote-id');
		if (quotesMap.has(id)) quotesMap.set(id, quotesMap.get(id).concat(e));
		else quotesMap.set(id, [e]);
	});

	return quotesMap;
}


