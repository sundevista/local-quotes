import LocalQuotes from "../main";
import {TFile} from "obsidian";
import {author_regexp, single_author_regexp, quote_regexp, search_or_regexp} from "../consts";
import {getAuthorIdx} from "../utils/scan";
import {BlockMetadataContent} from "./block-metadata";
import {getRandomArrayItem, getRandomAuthor, getRandomQuoteOfAuthor} from "../utils/random";

export interface Quote {
	author: string;
	quotes: string[];
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
	} else if (search_or_regexp.test(search)) {
		const authorList = getValidAuthorsFromAdvancedSearch(plugin, search);
		result.author = getRandomArrayItem(authorList);
	} else if (single_author_regexp.test(search)) {
		result.author = search;
	}

	result.text = getRandomQuoteOfAuthor(plugin, result.author);
	return result;
}


export async function uploadQuote(plugin: LocalQuotes, author: string, quote: string): Promise<void> {
	const idx: number = getAuthorIdx(plugin, author);

	if (idx >= 0) {
		if (!plugin.quoteVault[idx].quotes.contains(quote)) {
			plugin.quoteVault[idx].quotes.push(quote.trim());
		}
	} else {
		plugin.quoteVault.push({author: author, quotes: [quote.trim()]});
	}

	await plugin.saveSettings();
}

export async function updateQuotesVault(plugin: LocalQuotes, files: TFile[]): Promise<void> {
	plugin.quoteVault = [];

	let current_author: string;

	for (let file of files) {
		current_author = '';

		for (let line of (await plugin.app.vault.cachedRead(file)).split('\n')) {
			if (current_author && quote_regexp.test(line) && line.length >= plugin.settings.minimalQuoteLength) {
				// Quote case
				await uploadQuote(plugin, current_author, line.slice(2))
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
