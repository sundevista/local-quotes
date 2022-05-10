import {BlockMetadataContent} from "./block-metadata";
import LocalQuotes from "../main";
import {MarkdownPostProcessorContext} from "obsidian";
import {parseOneTimeCodeBlock} from "../utils/parser";
import {searchQuote} from "./quote";

export interface OneTimeBlock {
	filename: string;
	search: string;
	content: BlockMetadataContent;
	customClass: string;
}

function makeOneTimeBlock(plugin: LocalQuotes, rawOneTimeBlock: OneTimeBlock): OneTimeBlock {
	rawOneTimeBlock.content = searchQuote(plugin, rawOneTimeBlock.search);
	plugin.settings.oneTimeBlocks.push(rawOneTimeBlock);
	return rawOneTimeBlock;
}

function updateOneTimeBlock(plugin: LocalQuotes, rawOneTimeBlock: OneTimeBlock): OneTimeBlock {
	const otbIdx: number = plugin.settings.oneTimeBlocks
		.findIndex((o) => o.filename === rawOneTimeBlock.filename);
	const prevOtb: OneTimeBlock = plugin.settings.oneTimeBlocks[otbIdx];

	// Fields update
	if (prevOtb.customClass !== rawOneTimeBlock.customClass) {
		plugin.settings.oneTimeBlocks[otbIdx].customClass = rawOneTimeBlock.customClass;
	}
	if (prevOtb.search !== rawOneTimeBlock.search) {
		plugin.settings.oneTimeBlocks[otbIdx].search = rawOneTimeBlock.search;

		// Refresh quote if search changed
		plugin.settings.oneTimeBlocks[otbIdx].content = searchQuote(plugin, rawOneTimeBlock.search);
	}

	return plugin.settings.oneTimeBlocks[otbIdx];
}

export function selectOneTimeBlock(
	plugin: LocalQuotes,
	source: string,
	ctx: MarkdownPostProcessorContext
): OneTimeBlock {
	let tmpOtb: OneTimeBlock = parseOneTimeCodeBlock(source);

	// Template folder isn't set
	if (!plugin.settings.templateFolder) {
		return {
			content: {
				author: 'Local Quotes',
				text: 'Your template folder isn\'t set! Change it in the settings.'
			},
			customClass: tmpOtb.customClass,
			filename: null,
			search: null
		}
		// Inside template folder
	} else if (ctx.sourcePath.startsWith(plugin.settings.templateFolder)) {
		return {
			content: {
				author: 'Local Quotes',
				text: 'Your one time quote will be placed there, when time comes!'
			},
			customClass: tmpOtb.customClass,
			filename: null,
			search: null
		}
		// Time to use!
	} else {
		const splitSource = ctx.sourcePath.split('/');
		tmpOtb.filename = splitSource[splitSource.length - 1];
		const otbIdx = plugin.settings.oneTimeBlocks.findIndex((o) => o.filename === tmpOtb.filename);
		// Record exists
		if (otbIdx >= 0) {
			return updateOneTimeBlock(plugin, tmpOtb);
		} else {
			return makeOneTimeBlock(plugin, tmpOtb);
		}
	}
}
