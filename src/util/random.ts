import LocalQuotes from "../main";
import {getAuthorIdx} from "./scan";

function getRandomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

function getRandomQuoteOfAuthor(plugin: LocalQuotes, author: string): string {
	const authorIdx = getAuthorIdx(plugin, author);
	const quoteIdx = getRandomInt(plugin.quoteVault[authorIdx].quotes.length);
	return plugin.quoteVault[authorIdx].quotes[quoteIdx];
}
