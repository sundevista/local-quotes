import LocalQuotes from "../main";
import {parseCodeBlock} from "../util/parser";
import {getBlockMetadataIdx} from "../util/scan";
import {getCurrentSeconds} from "../util/date";
import {searchQuote} from "./quote";

export interface BlockMetadataContent {
	author: string;
	text: string;
}

export interface BlockMetadata {
	id: string;
	search: string;
	content: BlockMetadataContent,
	customClass: string;
	refresh: number;
	lastUpdate: number;
}

function makeBlockMetadata(plugin: LocalQuotes, rawBlockMetadata: BlockMetadata): BlockMetadata {
	rawBlockMetadata.content = searchQuote(plugin, rawBlockMetadata.search);
	rawBlockMetadata.lastUpdate = getCurrentSeconds();

	plugin.settings.blockMetadata.push(rawBlockMetadata);

	return rawBlockMetadata;
}

function updateBlockMetadata(plugin: LocalQuotes, rawBlockMetadata: BlockMetadata): BlockMetadata {
	const bmIdx: number = getBlockMetadataIdx(plugin, rawBlockMetadata.id);
	const prevBm: BlockMetadata = plugin.settings.blockMetadata[bmIdx];

	// Fields updating
	if (prevBm.search !== rawBlockMetadata.search) {
		plugin.settings.blockMetadata[bmIdx].search = rawBlockMetadata.search;
		plugin.settings.blockMetadata[bmIdx].content = searchQuote(plugin, rawBlockMetadata.search);
	}
	if (prevBm.customClass !== rawBlockMetadata.customClass) {
		plugin.settings.blockMetadata[bmIdx].customClass = rawBlockMetadata.customClass;
	}
	if (prevBm.refresh !== rawBlockMetadata.refresh) {
		plugin.settings.blockMetadata[bmIdx].refresh = rawBlockMetadata.refresh;
		plugin.settings.blockMetadata[bmIdx].content = searchQuote(plugin, rawBlockMetadata.search);
	}

	// Update quote
	let refreshInterval = plugin.settings.blockMetadata[bmIdx].refresh === null
			? plugin.settings.defaultReloadInterval
			: plugin.settings.blockMetadata[bmIdx].refresh;

	if ((plugin.settings.blockMetadata[bmIdx].lastUpdate + refreshInterval) < getCurrentSeconds()) {
		plugin.settings.blockMetadata[bmIdx].content = searchQuote(plugin, rawBlockMetadata.search);
		plugin.settings.blockMetadata[bmIdx].lastUpdate = getCurrentSeconds();
	}

	return plugin.settings.blockMetadata[bmIdx];
}

export function selectBlockMetadata(plugin: LocalQuotes, source: string): BlockMetadata {
	let tmpBm: BlockMetadata = parseCodeBlock(source);
	const idx: number = plugin.settings.blockMetadata.findIndex((e) => e.id === tmpBm.id);

	// If author and/or id aren't set, or quoteVault is empty
	if (!(tmpBm.id && tmpBm.search) || !plugin.quoteVault.length) {
		return {
			content: {
				author: 'Local Quotes',
				text: 'You caught an error! Maybe you don\'t set author or/and id, maybe you\'ve no quotes in the ' +
					'vault. You always can write an issue on GitHub'
			},
			customClass: null, id: null, lastUpdate: 0, refresh: null, search: null
		};
	} else {
		if (idx >= 0) {
			return updateBlockMetadata(plugin, tmpBm);
		} else {
			return makeBlockMetadata(plugin, tmpBm);
		}
	}
}
