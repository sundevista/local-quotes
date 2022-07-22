import {TFile} from 'obsidian';
import LocalQuotes from '../main';
import {Quote} from '../types/quote';

export function getAuthorIdx(quoteVault: Quote[], author: string): number {
	return quoteVault.findIndex((e) => e.author === author);
}

export function getBlockMetadataIdx(plugin: LocalQuotes, id: string): number {
	return plugin.settings.blockMetadata.findIndex((e) => e.id === id);
}

export function checkFileTag(f: TFile, tag: string): boolean {
	try {
		const fileCache = app.metadataCache.getFileCache(f);
		const tagInContent = fileCache && fileCache.tags &&
			(fileCache.tags.findIndex((t) => t.tag === `#${tag}`) >= 0);
		if (tagInContent) return true;
		const tagInFrontmatter = fileCache.frontmatter.tags.includes(tag);
		return !!tagInFrontmatter;
	} catch (e) {
		if (e instanceof TypeError) return false;
		else throw e;
	}
}

export function findTaggedFiles(tag: string): TFile[] {
	return app.vault.getMarkdownFiles().filter(file => checkFileTag(file, tag));
}
