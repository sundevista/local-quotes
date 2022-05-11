import LocalQuotes from "../main";
import {TFile} from "obsidian";
import {author_regexp, quote_regexp, search_regexp} from "../consts";
import {getAuthorIdx} from "../utils/scan";
import {BlockMetadataContent} from "./block-metadata";
import {getRandomArrayItem, getRandomAuthor, getRandomQuoteOfAuthor} from "../utils/random";
import {clearFromMarkdownStyling} from "../utils/parser";

export interface Quote {
	author: string;
	authorCode: string;
	quotes: string[];
}

export function getAuthorsCode(plugin: LocalQuotes, author: string): string {
	return plugin.quoteVault[getAuthorIdx(plugin, author)].authorCode;
}

export function fetchAuthorsInQuoteVault(plugin: LocalQuotes): Array<string> {
	return plugin.quoteVault.map((obj) => obj.author);
}

export function getValidAuthorsFromAdvancedSearch(plugin: LocalQuotes, search: string): string[] {
	return search.split('||')
		.map((a) => {
			if ((a.trim().length > 0) && (getAuthorIdx(plugin, a.trim()) >= 0)) return a.trim();
		});
}

export function searchQuote(plugin: LocalQuotes, search: string): BlockMetadataContent {
	let result: BlockMetadataContent = {author: null, text: null};

	// '*' case (random quote of random author)
	if (search === '*') {
		result.author = getRandomAuthor(plugin);
	} else if (search_regexp.test(search)) {
		const authorList = getValidAuthorsFromAdvancedSearch(plugin, search);
		result.author = getRandomArrayItem(authorList);
	}

	result.text = getRandomQuoteOfAuthor(plugin, result.author);
	return result;
}


export async function uploadQuote(plugin: LocalQuotes, authorCode: string, quote: string): Promise<void> {
	const author = clearFromMarkdownStyling(authorCode);
	quote = quote.trim();

	const idx: number = getAuthorIdx(plugin, author);

	if (idx >= 0) {
		if (!plugin.quoteVault[idx].quotes.includes(quote)) {
			plugin.quoteVault[idx].quotes.push(quote);
		}
	} else {
		plugin.quoteVault.push({author: author, authorCode: authorCode, quotes: [quote]});
	}

	await plugin.saveSettings();
}

export async function updateQuotesVault(plugin: LocalQuotes, files: TFile[]): Promise<void> {
	plugin.quoteVault = [];

	let current_author: string;

	for (let file of files) {
		current_author = '';

		for (let line of (await plugin.app.vault.cachedRead(file)).split('\n')) {
			line = line.trim();
			if (current_author && quote_regexp.test(line) && line.length >= plugin.settings.minimalQuoteLength) {
				// Quote case
				await uploadQuote(plugin, current_author, line.slice(line.indexOf(' ')));
			} else if (author_regexp.test(line)) {
				// Author case
				current_author = line.split(':::')[1]
			} else {
				// Empty line or other string (author reset case)
				current_author = '';
			}
		}
	}
}
