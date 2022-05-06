import LocalQuotes from "../main";
import {getAuthorIdx} from "./scan";

function getRandomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

export function getRandomQuoteOfAuthor(plugin: LocalQuotes, author: string): string {
	const authorIdx = getAuthorIdx(plugin, author);
	if (authorIdx < 0) {
		return 'You\'ve tried to find an author that doesn\'t exist';
	} else {
		const quoteIdx = getRandomInt(plugin.quoteVault[authorIdx].quotes.length);
		return plugin.quoteVault[authorIdx].quotes[quoteIdx];
	}
}
