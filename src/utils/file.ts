import { TAbstractFile, TFile } from 'obsidian';

export function convertTAbstractFileToTFile(absFile: TAbstractFile|TFile): TFile|null {
	if (absFile instanceof TFile) {
		return absFile as TFile;
	}
	return null;
}
