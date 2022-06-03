import LocalQuotes from '../main';
import { BlockMetadata, selectBlockMetadata } from '../types/block-metadata';
import { getAuthorsCode } from '../types/quote';
import { OneTimeBlock, selectOneTimeBlock } from '../types/one-time-block';
import { MarkdownPostProcessorContext, MarkdownRenderer } from 'obsidian';

export async function processCodeBlock(
	plugin: LocalQuotes,
	source: string,
	el: HTMLElement): Promise<void> {

	const blockMetadata: BlockMetadata = await selectBlockMetadata(plugin, source);

	el.addClass('el-blockquote');
	if (blockMetadata.customClass !== null) el.addClass(blockMetadata.customClass);
	const bq: HTMLElement = el.createEl('blockquote');
	el.appendChild(bq);

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

export async function processOneTimeCodeBlock(
	plugin: LocalQuotes,
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext): Promise<void> {

	const oneTimeBlock: OneTimeBlock = await selectOneTimeBlock(plugin, source, ctx);

	el.addClass('el-blockquote');
	if (oneTimeBlock.customClass !== null) el.addClass(oneTimeBlock.customClass);
	const bq: HTMLElement = el.createEl('blockquote');
	el.appendChild(bq);

	for (let p of plugin.settings.quoteBlockFormat.split('\n')) {
		await MarkdownRenderer.renderMarkdown(
			p.replace('{{content}}', oneTimeBlock.content.text.split('\n').join('<br/>'))
			.replace('{{author}}', plugin.settings.inheritListingStyle
				? getAuthorsCode(plugin.settings.quoteVault, oneTimeBlock.content.author)
				: oneTimeBlock.content.author),
			bq, '?no-dataview', null
		);
	}
}
