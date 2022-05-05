import {App, TFile} from "obsidian";

export function findTaggedFiles(app: App, tag: string): TFile[] {
	let result: TFile[] = [];

	for (let p of app.vault.getMarkdownFiles()) {
		if (app.metadataCache.getFileCache(p).tags && app.metadataCache.getFileCache(p).tags[0].tag == `#${tag}`) {
			result.push(p);
		}
	}

	return result;
}
