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
	const fileCache = app.metadataCache.getFileCache(f);
	const tagInContent = fileCache && fileCache.tags &&
		(fileCache.tags.findIndex((t) => t.tag === `#${tag}`) >= 0);
	const tagInFrontmatter = fileCache && fileCache.frontmatter &&
		fileCache.frontmatter.tags &&
		fileCache.frontmatter.tags.includes(tag);

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
