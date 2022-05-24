import { TFile } from 'obsidian';
import LocalQuotes from '../main';
import { Quote } from '../types/quote';

export function getAuthorIdx(quoteVault: Quote[], author: string): number {
	return quoteVault.findIndex((e) => e.author === author);
}

export function getBlockMetadataIdx(plugin: LocalQuotes, id: string): number {
	return plugin.settings.blockMetadata.findIndex((e) => e.id === id);
}

export function checkFileTag(f: TFile, tag: string): boolean {
	const tagInContent = app.metadataCache.getFileCache(f).tags &&
		(app.metadataCache.getFileCache(f).tags.findIndex((t) => t.tag === `#${tag}`) >= 0);
	const tagInFrontmatter = app.metadataCache.getFileCache(f).frontmatter &&
		app.metadataCache.getFileCache(f).frontmatter.tags &&
		app.metadataCache.getFileCache(f).frontmatter.tags.includes(tag);

	return tagInContent || tagInFrontmatter;
}

export function findTaggedFiles(tag: string): TFile[] {
	let result: TFile[] = [];

	for (let p of app.vault.getMarkdownFiles()) {
		if (checkFileTag(p, tag)) {
			result.push(p);
		}
	}

	return result;
}
