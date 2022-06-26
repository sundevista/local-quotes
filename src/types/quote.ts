import LocalQuotes from '../main';
import {TFile} from 'obsidian';
import {author_regexp, quote_long_regexp, quote_regexp, search_regexp} from '../consts';
import {getAuthorIdx} from '../utils/scan';
import {BlockMetadataContent} from './block-metadata';
import {getRandomArrayItem, getRandomAuthor, getRandomQuoteOfAuthor, getWeightedRandomAuthor} from '../utils/random';
import {removeMd} from '../libs/remove_markdown';
import {getFilesQuotesIdx, isFileHaveAuthorsQuote} from "../utils/file";

export interface Quote {
	author: string;
	authorCode: string;
	files: FilesQuotes[];
}

export interface FilesQuotes {
	filename: string;
	quotes: string[];
}

export type QuotesMap = Map<string,HTMLElement[]>;

export function getValidAuthorsFromAdvancedSearch(quoteVault: Quote[], search: string): string[] {
	const list = search.split('||').map((a) => {
		a = a.trim();
		if ((a.length > 0) && (getAuthorIdx(quoteVault, a) >= 0)) return a;
	});
	return list[0] !== undefined ? list : [];
}

export function searchQuote(quoteVault: Quote[], search: string, useWeightedRandom: boolean): BlockMetadataContent {
	let result: BlockMetadataContent = { author: null, text: null };

	// '*' case (random quote of random author)
	if (search === '*') {
		result.author = useWeightedRandom
			? getWeightedRandomAuthor(quoteVault)
			: getRandomAuthor(quoteVault);
	} else if (search_regexp.test(search)) {
		const authorList = getValidAuthorsFromAdvancedSearch(quoteVault, search);
		result.author = useWeightedRandom
			? getWeightedRandomAuthor(quoteVault, authorList)
			: getRandomArrayItem(authorList);
	}

	result.text = getRandomQuoteOfAuthor(quoteVault, result.author);
	return result;
}

export async function uploadQuote(
	quoteVault: Quote[],
	filename: string,
	authorCode: string,
	quote: string
): Promise<void> {
	const author = removeMd(authorCode);
	quote = quote.trim();

	const idx: number = getAuthorIdx(quoteVault, author);

	if (idx >= 0) {
		if (!isFileHaveAuthorsQuote(quoteVault, filename, author, quote)) {
			const filesQuotesIdx = getFilesQuotesIdx(quoteVault, filename, author);

			quoteVault[idx].files[filesQuotesIdx] = {
				filename: filename,
				quotes: [...quoteVault[idx].files[filesQuotesIdx].quotes, quote]
			};
		}
	} else {
		const tmpFilesQuotes: FilesQuotes = {
			filename: filename,
			quotes: [quote]
		};
		quoteVault.push({ author: author, authorCode: authorCode, files: [tmpFilesQuotes] });
	}
}

export function appendToLastQuote(quoteVault: Quote[], filename: string, author: string, text: string): void {
	const authorIdx: number = getAuthorIdx(quoteVault, author);
	const filesQuotesIdx: number = getFilesQuotesIdx(quoteVault, filename, author);
	const quoteIdx: number = quoteVault[authorIdx].files[filesQuotesIdx].quotes.length - 1;

	quoteVault[authorIdx].files[filesQuotesIdx].quotes[quoteIdx] =
		quoteVault[authorIdx].files[filesQuotesIdx].quotes[quoteIdx] + '\n' + text;
}

export async function updateQuotesVault(plugin: LocalQuotes, files: TFile[]): Promise<void> {
	let tmpQuoteVault: Quote[] = [];

	for (let file of files) {
		let current_author = '';

		for (let line of (await plugin.app.vault.cachedRead(file)).split('\n')) {
			let tline = line.trim();
			if (current_author && quote_regexp.test(tline) && tline.length >= plugin.settings.minimalQuoteLength) {
				// Quote case
				await uploadQuote(tmpQuoteVault, file.name, current_author, tline.slice(line.indexOf(' ')));
			} else if (current_author && quote_long_regexp.test(line)
				&& tline.length >= plugin.settings.minimalQuoteLength) {
				// Multi-line quote appendix
				appendToLastQuote(tmpQuoteVault, file.name, removeMd(current_author), tline);
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
