import { getAuthorIdx } from "./scan";
import { Quote } from "../types/quote";

export function getAuthorsCode(quoteVault: Quote[], author: string): string {
  return quoteVault[getAuthorIdx(quoteVault, author)].authorCode;
}

export function fetchAuthorsInQuoteVault(quoteVault: Quote[]): Array<string> {
  return quoteVault.map((obj) => obj.author);
}

export function fetchAllAuthorsQuotes(
  quoteVault: Quote[],
  author: string
): string[] {
  const quotes: string[] = [];
  const authorIdx = getAuthorIdx(quoteVault, author);

  for (const entry of quoteVault[authorIdx].files) {
    quotes.push(...entry.quotes);
  }

  return quotes;
}
