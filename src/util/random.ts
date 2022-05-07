import LocalQuotes from "../main";
import {getAuthorIdx} from "./scan";

export function getRandomQuoteId(length: number = 5): string {
	const characters = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM1234567890-';
	let result = '';

	for (let i = 0; i < length; i++) {
		result += characters[getRandomInt(characters.length)];
	}

	return result;
}

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
