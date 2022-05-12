import LocalQuotes from "../main";
import {BlockMetadata, selectBlockMetadata} from "../types/block-metadata";
import {getAuthorsCode, updateQuotesVault} from "../types/quote";
import {findTaggedFiles} from "../utils/scan";
import {parseMdToHtml} from "../utils/parser";
import {OneTimeBlock, selectOneTimeBlock} from "../types/one-time-block";
import {MarkdownPostProcessorContext} from "obsidian";
import {isStringWeakForInnerHtmlVulnerability} from "../utils/dom";

export async function processCodeBlock(
	plugin: LocalQuotes,
	source: string,
	el: HTMLElement): Promise<void> {

	if (plugin.settings.quoteScanOnBlockRender) {
		await updateQuotesVault(plugin, findTaggedFiles(plugin.settings.quoteTag));
	}

	const blockMetadata: BlockMetadata = selectBlockMetadata(plugin, source);

	await plugin.saveSettings();

	el.addClass('el-blockquote');
	if (blockMetadata.customClass !== null) el.addClass(blockMetadata.customClass);
	const bq: HTMLElement = el.createEl('blockquote');
	el.appendChild(bq);

	if (isStringWeakForInnerHtmlVulnerability(blockMetadata.content.text + blockMetadata.content.author)) {
		bq.innerText = 'Remove script tag from your quote, tricky fox!';
		return;
	}

	for (let p of plugin.settings.quoteBlockFormat.split('\n')) {
		bq.innerHTML += parseMdToHtml(p.replace('{{content}}', blockMetadata.content.text)
			.replace(
				'{{author}}',
				plugin.settings.inheritListingStyle
					? getAuthorsCode(plugin.settings.quoteVault, blockMetadata.content.author)
					: blockMetadata.content.author
			)
		);
	}
}

export async function processOneTimeCodeBlock(
	plugin: LocalQuotes,
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext): Promise<void> {

	await updateQuotesVault(plugin, findTaggedFiles(plugin.settings.quoteTag));

	const oneTimeBlock: OneTimeBlock = selectOneTimeBlock(plugin, source, ctx);

	await plugin.saveSettings();

	el.addClass('el-blockquote');
	if (oneTimeBlock.customClass !== null) el.addClass(oneTimeBlock.customClass);
	const bq: HTMLElement = el.createEl('blockquote');
	el.appendChild(bq);

	if (isStringWeakForInnerHtmlVulnerability(oneTimeBlock.content.text + oneTimeBlock.content.author)) {
		bq.innerText = 'Remove script tag from your quote, tricky fox!';
		return;
	}

	for (let p of plugin.settings.quoteBlockFormat.split('\n')) {
		bq.innerHTML += parseMdToHtml(p.replace('{{content}}', oneTimeBlock.content.text)
			.replace(
				'{{author}}',
				plugin.settings.inheritListingStyle
					? getAuthorsCode(plugin.settings.quoteVault, oneTimeBlock.content.author)
					: oneTimeBlock.content.author
			)
		);
	}
}
