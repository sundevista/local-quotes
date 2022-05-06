import LocalQuotes from "../main";
import {selectBlockMetadata} from "../types/blockmetadata";
import {quote_format} from "../consts";
import {updateQuotesVault} from "../types/quote";
import {findTaggedFiles} from "../util/scan";

export async function processCodeblock(
	plugin: LocalQuotes,
	source: string,
	el: HTMLElement): Promise<void>
{
	await updateQuotesVault(plugin, findTaggedFiles(plugin.app, plugin.settings.quoteTag))

	let mb = selectBlockMetadata(plugin, source);

	await plugin.saveSettings();

	el.addClass('el-blockquote');
	if (mb.customClass !== null) el.addClass(mb.customClass);
	const bq = el.createEl('blockquote');
	el.appendChild(bq);

	for (let p of quote_format.split('\n')) {
		bq.appendChild(el.createEl(
			'p',
			{
				text: p.replace('{{content}}', mb.text)
					.replace('{{author}}', mb.author)
			}
		));
	}
}