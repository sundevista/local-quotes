import LocalQuotes from "../main";
import {BlockMetadata, selectBlockMetadata} from "../types/blockmetadata";
import {updateQuotesVault} from "../types/quote";
import {findTaggedFiles} from "../util/scan";
import {parseMdToHtml} from "../util/parser";
import {OneTimeBlock, selectOneTimeBlock} from "../types/onetime";
import {MarkdownPostProcessorContext} from "obsidian";

export async function processCodeblock(
	plugin: LocalQuotes,
	source: string,
	el: HTMLElement): Promise<void> {
	await updateQuotesVault(plugin, findTaggedFiles(plugin.settings.quoteTag));

	const mb: BlockMetadata = selectBlockMetadata(plugin, source);

	await plugin.saveSettings();

	el.addClass('el-blockquote');
	if (mb.customClass !== null) el.addClass(mb.customClass);
	const bq: HTMLElement = el.createEl('blockquote');
	el.appendChild(bq);

	for (let p of plugin.settings.quoteBlockFormat.split('\n')) {
		bq.innerHTML += parseMdToHtml(p.replace('{{content}}', mb.content.text)
			.replace('{{author}}', mb.content.author));
	}
}

export async function processOneTimeCodeBlock(
	plugin: LocalQuotes,
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext): Promise<void> {
	await updateQuotesVault(plugin, findTaggedFiles(plugin.settings.quoteTag));

	const otb: OneTimeBlock = selectOneTimeBlock(plugin, source, ctx);

	await plugin.saveSettings();

	el.addClass('el-blockquote');
	if (otb.customClass !== null) el.addClass(otb.customClass);
	const bq: HTMLElement = el.createEl('blockquote');
	el.appendChild(bq);

	for (let p of plugin.settings.quoteBlockFormat.split('\n')) {
		bq.innerHTML += parseMdToHtml(p.replace('{{content}}', otb.content.text)
			.replace('{{author}}', otb.content.author));
	}
}
