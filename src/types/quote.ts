import LocalQuotes from "../main";
import {TFile} from "obsidian";
import {author_regexp, quote_long_regexp, quote_regexp, search_regexp} from "../consts";
import {getAuthorIdx} from "../utils/scan";
import {BlockMetadataContent} from "./block-metadata";
import {getRandomArrayItem, getRandomAuthor, getRandomQuoteOfAuthor} from "../utils/random";
import { removeMd } from '../libs/remove_markdown';

export interface Quote {
	author: string;
	authorCode: string;
	quotes: string[];
}

export function getAuthorsCode(quoteVault: Quote[], author: string): string {
	return quoteVault[getAuthorIdx(quoteVault, author)].authorCode;
}

export function fetchAuthorsInQuoteVault(quoteVault: Quote[]): Array<string> {
	return quoteVault.map((obj) => obj.author);
}

export function getValidAuthorsFromAdvancedSearch(quoteVault: Quote[], search: string): string[] {
	return search.split('||')
		.map((a) => {
			a = a.trim();
			if ((a.length > 0) && (getAuthorIdx(quoteVault, a) >= 0)) return a;
		});
}

export function searchQuote(quoteVault: Quote[], search: string): BlockMetadataContent {
	let result: BlockMetadataContent = {author: null, text: null};

	// '*' case (random quote of random author)
	if (search === '*') {
		result.author = getRandomAuthor(quoteVault);
	} else if (search_regexp.test(search)) {
		const authorList = getValidAuthorsFromAdvancedSearch(quoteVault, search);
		result.author = getRandomArrayItem(authorList);
	}

	result.text = getRandomQuoteOfAuthor(quoteVault, result.author);
	return result;
}


export async function uploadQuote(quoteVault: Quote[], authorCode: string, quote: string): Promise<void> {
	const author = removeMd(authorCode);
	quote = quote.trim();

	const idx: number = getAuthorIdx(quoteVault, author);

	if (idx >= 0) {
		if (!quoteVault[idx].quotes.includes(quote)) {
			quoteVault[idx].quotes.push(quote);
		}
	} else {
		quoteVault.push({author: author, authorCode: authorCode, quotes: [quote]});
	}
}

export function appendToLastQuote(quoteVault: Quote[], author: string, text: string): void {
	const authorIdx: number = getAuthorIdx(quoteVault, author);
	const quoteIdx: number = quoteVault[authorIdx].quotes.length - 1;

	quoteVault[authorIdx].quotes[quoteIdx] = quoteVault[authorIdx].quotes[quoteIdx] + '\n' + text;
}

export async function updateQuotesVault(plugin: LocalQuotes, files: TFile[]): Promise<void> {
	let tmpQuoteVault: Quote[] = [];

	let current_author: string;

	for (let file of files) {
		current_author = '';

		for (let line of (await plugin.app.vault.cachedRead(file)).split('\n')) {
			let tline = line.trim();
			if (current_author && quote_regexp.test(tline) && tline.length >= plugin.settings.minimalQuoteLength) {
				// Quote case
				await uploadQuote(tmpQuoteVault, current_author, tline.slice(line.indexOf(' ')));
			} else if (current_author && quote_long_regexp.test(line)
				&& tline.length >= plugin.settings.minimalQuoteLength) {
				// Multi-line quote appendix
				appendToLastQuote(tmpQuoteVault, removeMd(current_author), tline);
			} else if (author_regexp.test(tline)) {
				// Author case
				current_author = line.split(':::')[1].trim();
			} else {
				// Empty line or other string (author reset case)
				current_author = '';
			}
		}
	}

	plugin.settings.quoteVault = tmpQuoteVault;
	await plugin.saveSettings();
}
