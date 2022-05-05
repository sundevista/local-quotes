import {App, TFile} from "obsidian";
import LocalQuotes from "./main";

export function findTaggedFiles(app: App, tag: string): TFile[] {
	let result: TFile[] = [];

	for (let p of app.vault.getMarkdownFiles()) {
		if (app.metadataCache.getFileCache(p).tags && app.metadataCache.getFileCache(p).tags[0].tag == `#${tag}`) {
			result.push(p);
		}
	}

	return result;
}

export async function uploadQuote(plugin: LocalQuotes, author: string, quote: string): Promise<void> {
	const idx = plugin.settings.quoteVault.findIndex((e) => e.author === author);

	if (idx >= 0) {
		if (!plugin.settings.quoteVault[idx].quotes.contains(quote)) {
			plugin.settings.quoteVault[idx].quotes.push(quote);
		}
	} else {
		plugin.settings.quoteVault.push({author: author, quotes: [quote]});
	}

	await plugin.saveSettings();
}

export async function updateQuotesVault(plugin: LocalQuotes, files: TFile[]): Promise<void> {
	const author_regexp = /:::\w+:::/gm;
	const quote_regexp = /(- \w+)|(\d. \w+)/gm;

	let current_author;

	for (let file of files) {
		current_author = '';

		for (let line of (await plugin.app.vault.cachedRead(file)).split('\n')) {
			if (current_author && line.match(quote_regexp)) {
				// Quote case
				await uploadQuote(plugin, current_author, line.slice(2))
			} else if (line.match(author_regexp)) {
				// Author case
				current_author = line.split(':::')[1]
			} else {
				// Empty line or other string (author reset case)
				current_author = '';
			}
		}
	}
}
