import LocalQuotes from '../main';
import { TAbstractFile, TFile } from 'obsidian';
import { author_regexp, quote_long_regexp, quote_regexp, search_regexp } from '../consts';
import { checkFileTag, getAuthorIdx } from '../utils/scan';
import { BlockMetadataContent } from './block-metadata';
import { getRandomArrayItem, getRandomAuthor, getRandomQuoteOfAuthor } from '../utils/random';
import { removeMd } from '../libs/remove_markdown';
import { convertTAbstractFileToTFile } from '../utils/file';

export interface Quote {
	author: string;
	authorCode: string;
	files: FilesQuotes[];
}

export interface FilesQuotes {
	filename: string;
	quotes: string[];
}

export async function onFileModify(plugin: LocalQuotes, file: TFile|TAbstractFile): Promise<void> {
	const f: TFile = convertTAbstractFileToTFile(file);

	if (checkFileTag(f, plugin.settings.quoteTag)) {
		clearFileEntries(plugin.settings.quoteVault, file.name);
		await updateQuotesVault(plugin, [f]);
	}
}

export function getAuthorsCode(quoteVault: Quote[], author: string): string {
	return quoteVault[getAuthorIdx(quoteVault, author)].authorCode;
}

export function fetchAuthorsInQuoteVault(quoteVault: Quote[]): Array<string> {
	return quoteVault.map((obj) => obj.author);
}

export function fetchAllAuthorsQuotes(quoteVault: Quote[], author: string): string[] {
	let quotes: string[] = [];
	const authorIdx = getAuthorIdx(quoteVault, author);

	for (let entry of quoteVault[authorIdx].files) {
		quotes.push(...entry.quotes);
	}

	return quotes;
}

function clearFileEntries(quoteVault: Quote[], filename: string): void {
	for (let [eIdx, _] of quoteVault.entries()) {
		quoteVault[eIdx].files = quoteVault[eIdx].files.filter((f) => f.filename !== filename);
	}
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

export function isFileHaveAuthorsQuote(quoteVault: Quote[], filename: string, author: string, quote: string): boolean {
	for (let entry of quoteVault[getAuthorIdx(quoteVault, author)].files) {
		if (entry.filename == filename && entry.quotes.includes(quote)) {
			return true;
		}
	}
	return false
}

export function getFilesQuotesIdx(quoteVault: Quote[], filename: string, author: string): number {
	return quoteVault[getAuthorIdx(quoteVault, author)].files.findIndex((e) => e.filename == filename);
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
		}
		quoteVault.push({author: author, authorCode: authorCode, files: [tmpFilesQuotes]});
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

	let current_author: string;

	for (let file of files) {
		current_author = '';

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
