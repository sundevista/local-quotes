import LocalQuotes from "../main";
import {BlockMetadata, selectBlockMetadata} from "../types/blockmetadata";
import {updateQuotesVault} from "../types/quote";
import {findTaggedFiles} from "../util/scan";

export async function processCodeblock(
	plugin: LocalQuotes,
	source: string,
	el: HTMLElement): Promise<void>
{
	await updateQuotesVault(plugin, findTaggedFiles(plugin.settings.quoteTag))

	let mb: BlockMetadata = selectBlockMetadata(plugin, source);

	await plugin.saveSettings();

	el.addClass('el-blockquote');
	if (mb.customClass !== null) el.addClass(mb.customClass);
	const bq: HTMLElement = el.createEl('blockquote');
	el.appendChild(bq);

	for (let p of plugin.settings.quoteBlockFormat.split('\n')) {
		let e = el.createEl('p');
		e.innerHTML = p.replace('{{content}}', mb.content.text)
			.replace('{{author}}', mb.content.author);

		bq.appendChild(e);
	}
}
