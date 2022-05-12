import {getAuthorIdx} from "./scan";
import {Quote} from "../types/quote";

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

export function getRandomAuthor(quoteVault: Quote[]): string {
	return getRandomArrayItem(quoteVault).author;
}

export function getRandomQuoteOfAuthor(quoteVault: Quote[], author: string): string {
	const authorIdx: number = getAuthorIdx(quoteVault, author);

	if (authorIdx < 0) {
		return 'You\'ve tried to find an author that doesn\'t exist';
	} else {
		const quoteIdx = getRandomInt(quoteVault[authorIdx].quotes.length);
		return quoteVault[authorIdx].quotes[quoteIdx];
	}
}
