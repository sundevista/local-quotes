import {App, TFile} from "obsidian";
import LocalQuotes from "../main";

export function getAuthorIdx(plugin: LocalQuotes, author: string): number {
	return plugin.quoteVault.findIndex((e) => e.author === author);
}

export function getBlockMetadataIdx(plugin: LocalQuotes, id: string): number {
	return plugin.settings.blockMetadata.findIndex((e) => e.id === id);
}

function checkFileTag(app: App, f: TFile, tag: string): boolean {
	const tagInContent = app.metadataCache.getFileCache(f).tags &&
		(app.metadataCache.getFileCache(f).tags.findIndex((t) => t.tag === `#${tag}`) >= 0);
	const tagInFrontmatter = app.metadataCache.getFileCache(f).frontmatter &&
		app.metadataCache.getFileCache(f).frontmatter.tags &&
		app.metadataCache.getFileCache(f).frontmatter.tags.includes(tag);

	return tagInContent || tagInFrontmatter;
}

export function findTaggedFiles(app: App, tag: string): TFile[] {
	let result: TFile[] = [];

	for (let p of app.vault.getMarkdownFiles()) {
		if (checkFileTag(app, p, tag)) {
			result.push(p);
			console.log(app.metadataCache.getFileCache(p));
		}
	}

	return result;
}
