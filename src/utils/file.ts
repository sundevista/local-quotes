import LocalQuotes from "../main";
import { TFile } from "obsidian";
import { checkFileTag, getAuthorIdx } from "./scan";
import { Quote, updateQuotesVault } from "../types/quote";

export async function onFileModify(
  plugin: LocalQuotes,
  file: TFile
): Promise<void> {
  if (
    checkFileTag(
      plugin.app,
      file,
      plugin.settings.quoteTag,
      plugin.settings.displayWarnings
    )
  ) {
    clearFileEntries(plugin.settings.quoteVault, file.name);
    await updateQuotesVault(plugin, [file]);
  }
}

function clearFileEntries(quoteVault: Quote[], filename: string): void {
  for (const [eIdx, _] of quoteVault.entries()) {
    quoteVault[eIdx].files = quoteVault[eIdx].files.filter(
      (f) => f.filename !== filename
    );
  }
}

export function isFileHaveAuthorsQuote(
  quoteVault: Quote[],
  filename: string,
  author: string,
  quote: string
): boolean {
  for (const entry of quoteVault[getAuthorIdx(quoteVault, author)].files) {
    if (entry.filename == filename && entry.quotes.includes(quote)) {
      return true;
    }
  }
  return false;
}

export function getFilesQuotesIdx(
  quoteVault: Quote[],
  filename: string,
  author: string
): number {
  return quoteVault[getAuthorIdx(quoteVault, author)].files.findIndex(
    (e) => e.filename == filename
  );
}
