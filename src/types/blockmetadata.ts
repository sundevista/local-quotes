import LocalQuotes from "../main";
import {parseCodeBlock} from "../util/parser";
import {getRandomQuoteOfAuthor} from "../util/random";
import {getBlockMetadataIdx} from "../util/scan";
import {getCurrentSeconds} from "../util/date";

export interface BlockMetadata {
	id: string;
	author: string;
	text: string;
	lastUpdate: number;
	reloadInterval: number;
	customClass: string;
}

function makeBlockMetadata(plugin: LocalQuotes, rawBlockMetadata: BlockMetadata): BlockMetadata {
	rawBlockMetadata.text = getRandomQuoteOfAuthor(plugin, rawBlockMetadata.author);
	rawBlockMetadata.lastUpdate = getCurrentSeconds();

	plugin.settings.blockMetadata.push(rawBlockMetadata);

	return rawBlockMetadata;
}

function updateBlockMetadata(plugin: LocalQuotes, rawBlockMetadata: BlockMetadata): BlockMetadata {
	const bmIdx: number = getBlockMetadataIdx(plugin, rawBlockMetadata.id);
	const prevBm: BlockMetadata = plugin.settings.blockMetadata[bmIdx];

	// Fields updating
	if (prevBm.author !== rawBlockMetadata.author) {
		plugin.settings.blockMetadata[bmIdx].author = rawBlockMetadata.author;
		plugin.settings.blockMetadata[bmIdx].text = getRandomQuoteOfAuthor(plugin, rawBlockMetadata.author);
	}
	if (prevBm.customClass !== rawBlockMetadata.customClass) {
		plugin.settings.blockMetadata[bmIdx].customClass = rawBlockMetadata.customClass;
	}
	if (prevBm.reloadInterval !== rawBlockMetadata.reloadInterval) {
		plugin.settings.blockMetadata[bmIdx].reloadInterval = rawBlockMetadata.reloadInterval;
		plugin.settings.blockMetadata[bmIdx].text = getRandomQuoteOfAuthor(plugin, rawBlockMetadata.author);
	}

	// Update quote
	let reloadInterval = plugin.settings.blockMetadata[bmIdx].reloadInterval === null
			? plugin.settings.defaultReloadInterval
			: plugin.settings.blockMetadata[bmIdx].reloadInterval;

	if ((plugin.settings.blockMetadata[bmIdx].lastUpdate + reloadInterval) < getCurrentSeconds()) {
		plugin.settings.blockMetadata[bmIdx].text = getRandomQuoteOfAuthor(plugin, rawBlockMetadata.author);
		plugin.settings.blockMetadata[bmIdx].lastUpdate = getCurrentSeconds();
	}

	return plugin.settings.blockMetadata[bmIdx];
}

export function selectBlockMetadata(plugin: LocalQuotes, source: string): BlockMetadata {
	let tmpBm: BlockMetadata = parseCodeBlock(source);
	const idx: number = plugin.settings.blockMetadata.findIndex((e) => e.id === tmpBm.id);

	// If author and/or id aren't set
	if (!(tmpBm.id && tmpBm.author) || !plugin.quoteVault.length) {
		return {
			author: 'Local Quotes',
			text: 'You caught an error! Maybe you don\'t set author or/and id, maybe you\'ve no quotes in the vault.' +
				' You always can write an issue on GitHub',
			customClass: null, id: null, lastUpdate: null, reloadInterval: null
		}
	} else {
		if (idx >= 0) {
			return updateBlockMetadata(plugin, tmpBm);
		} else {
			return makeBlockMetadata(plugin, tmpBm);
		}
	}
}
