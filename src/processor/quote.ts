import LocalQuotes from "../main";
import {TFile} from "obsidian";
import {author_regexp, quote_regexp} from "../consts";

export async function uploadQuote(plugin: LocalQuotes, author: string, quote: string): Promise<void> {
	const idx = plugin.quoteVault.findIndex((e) => e.author === author);

	if (idx >= 0) {
		if (!plugin.quoteVault[idx].quotes.contains(quote)) {
			plugin.quoteVault[idx].quotes.push(quote);
		}
	} else {
		plugin.quoteVault.push({author: author, quotes: [quote]});
	}

	await plugin.saveSettings();
}

export async function updateQuotesVault(plugin: LocalQuotes, files: TFile[]): Promise<void> {
	plugin.quoteVault = [];

	let current_author;

	for (let file of files) {
		current_author = '';

		for (let line of (await plugin.app.vault.cachedRead(file)).split('\n')) {
			if (current_author && line.match(quote_regexp) && line.length >= plugin.settings.minimalQuoteLength) {
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
