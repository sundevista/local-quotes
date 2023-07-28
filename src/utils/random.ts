import { getAuthorIdx } from "./scan";
import { Quote } from "../types/quote";
import { fetchAllAuthorsQuotes } from "./quoteVault";

export function getRandomQuoteId(length: number = 5): string {
  const characters: string =
    "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM1234567890-_";
  let result: string = "";

  for (let i = 0; i < length; i++) {
    result += getRandomCharOfString(characters);
  }

  return result;
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function getRandomArrayItem<T>(arr: T[]): T {
  return arr[getRandomInt(arr.length)];
}

function getRandomCharOfString(str: string): string {
  return str[getRandomInt(str.length)];
}

export function getRandomAuthor(quoteVault: Quote[]): string {
  return getRandomArrayItem<Quote>(quoteVault).author;
}

export function getWeightedRandomAuthor(
  quoteVault: Quote[],
  customAuthorList: string[] | null = null
): string {
  let authorToQuoteList: [string, number][];

  if (customAuthorList !== null) {
    authorToQuoteList = customAuthorList.map((e) => {
      let quoteQuantity = 0;
      const author: Quote = quoteVault.find((q) => q.author == e);
      author.files.forEach((f) => (quoteQuantity += f.quotes.length));
      return [e, quoteQuantity];
    });
  } else {
    authorToQuoteList = quoteVault.map((e) => {
      let quoteQuantity = 0;
      e.files.forEach((f) => (quoteQuantity += f.quotes.length));
      return [e.author, quoteQuantity];
    });
  }

  let quotesSum = 0;
  authorToQuoteList.forEach((e) => (quotesSum += e[1]));

  const weightedAuthorList: [string, number][] = authorToQuoteList.map((e) => [
    e[0],
    e[1] / quotesSum,
  ]);
  return getWeightedRandomElement<string>(weightedAuthorList);
}

function getWeightedRandomElement<T>(arr: [T, number][]): T {
  let i,
    sum = 0;
  const r = Math.random();

  for (i in arr) {
    sum += arr[i][1];
    if (r <= sum) return arr[i][0];
  }
}

export function getRandomQuoteOfAuthor(
  quoteVault: Quote[],
  author: string
): string {
  const authorIdx: number = getAuthorIdx(quoteVault, author);

  if (authorIdx < 0) {
    return "You've tried to find an author that doesn't exist";
  } else {
    const quotes: string[] = fetchAllAuthorsQuotes(quoteVault, author);
    return quotes[getRandomInt(quotes.length)];
  }
}
