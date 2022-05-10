import LocalQuotes from "../main";
import {getAuthorIdx} from "./scan";

export function getRandomQuoteId(length: number = 5): string {
	const characters: string = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM1234567890-_';
	let result: string = '';

	for (let i = 0; i < length; i++) {
		result += getRandomArrayItem(characters);
	}

	return result;
}

function getRandomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

export function getRandomArrayItem(arr: any[] | string): any {
	return arr[getRandomInt(arr.length)];
}

export function getRandomAuthor(plugin: LocalQuotes): string {
	return getRandomArrayItem(plugin.quoteVault).author;
}

export function getRandomQuoteOfAuthor(plugin: LocalQuotes, author: string): string {
	const authorIdx: number = getAuthorIdx(plugin, author);
	if (authorIdx < 0) {
		return 'You\'ve tried to find an author that doesn\'t exist';
	} else {
		const quoteIdx = getRandomInt(plugin.quoteVault[authorIdx].quotes.length);
		return plugin.quoteVault[authorIdx].quotes[quoteIdx];
	}
}
