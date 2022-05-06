import {App, TFile} from "obsidian";
import LocalQuotes from "../main";

export function getAuthorIdx(plugin: LocalQuotes, author: string): number {
	return plugin.quoteVault.findIndex((e) => e.author === author);
}

export function getBlockMetadataIdx(plugin: LocalQuotes, id: string): number {
	return plugin.settings.blockMetadata.findIndex((e) => e.id === id);
}

export function findTaggedFiles(app: App, tag: string): TFile[] {
	let result: TFile[] = [];

	for (let p of app.vault.getMarkdownFiles()) {
		if (app.metadataCache.getFileCache(p).tags && app.metadataCache.getFileCache(p).tags[0].tag == `#${tag}`) {
			result.push(p);
		}
	}

	return result;
}
