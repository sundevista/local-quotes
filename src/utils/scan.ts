import { App, TFile } from "obsidian";
import LocalQuotes from "../main";
import { Quote } from "../types/quote";
import { quote_tag } from "../consts";

export function extractTags(quoteString: string): string[] {
  return quoteString.match(quote_tag);
}

export function getAuthorIdx(quoteVault: Quote[], author: string): number {
  return quoteVault.findIndex((e) => e.author === author);
}

export function getBlockMetadataIdx(plugin: LocalQuotes, id: string): number {
  return plugin.settings.blockMetadata.findIndex((e) => e.id === id);
}

export function checkFileTag(
  app: App,
  f: TFile,
  tag: string,
  displayWarnings: boolean = true
): boolean {
  try {
    const fileCache = app.metadataCache.getFileCache(f);
    const tagInContent =
      fileCache &&
      fileCache.tags &&
      fileCache.tags.findIndex((t) => t.tag === `#${tag}`) >= 0;
    if (tagInContent) return true;
    const tagInFrontmatter =
      fileCache &&
      fileCache.frontmatter &&
      fileCache.frontmatter.tags &&
      fileCache.frontmatter.tags.includes(tag);
    if (tagInFrontmatter) return true;
  } catch (e) {
    if (e instanceof TypeError) {
      if (displayWarnings)
        console.log(
          "! This file may have invalid YAML: " +
            f.name +
            " (" +
            f.path +
            ").\n" +
            "You can disable warnings in the settings of the Local Quotes plugin."
        );
      return false;
    } else throw e;
  }
}

export function findTaggedFiles(
  app: App,
  tag: string,
  displayWarnings: boolean = true
): TFile[] {
  return app.vault
    .getMarkdownFiles()
    .filter((file) => checkFileTag(app, file, tag, displayWarnings));
}
