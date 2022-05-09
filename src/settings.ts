import {App, Notice, PluginSettingTab, Setting} from "obsidian";
import LocalQuotes from "./main";
import {BlockMetadata} from "./types/blockmetadata";
import {sec_in_day} from "./consts";
import {OneTimeBlock} from "./types/onetime";

export interface LocalQuotesSettings {
	quoteTag: string;
	defaultReloadInterval: number;
	minimalQuoteLength: number;
	showReloadButton: boolean;
	quoteBlockFormat: string;
	blockMetadata: BlockMetadata[];
	oneTimeBlocks: OneTimeBlock[];
	templateFolder: string;
}

export const DEFAULT_SETTINGS: LocalQuotesSettings = {
	quoteTag: 'quotes',
	defaultReloadInterval: sec_in_day,
	minimalQuoteLength: 5,
	showReloadButton: false,
	quoteBlockFormat: '{{content}}\n— {{author}}',
	blockMetadata: [],
	oneTimeBlocks: [],
	templateFolder: '',
}

export class LocalQuotesSettingTab extends PluginSettingTab {
	plugin: LocalQuotes;

	constructor(app: App, plugin: LocalQuotes) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'General'});

		new Setting(containerEl)
			.setName('Quote tag')
			.setDesc('Tag name that will be used for searching notes with quotes')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.quoteTag)
				.setValue(this.plugin.settings.quoteTag)
				.onChange(async (value) => {
					this.plugin.settings.quoteTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Refresh interval')
			.setDesc('You can set default refresh interval and miss corresponding field in codeblock (in seconds)')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.defaultReloadInterval.toString())
				.setValue(this.plugin.settings.defaultReloadInterval.toString())
				.onChange(async (value) => {
					this.plugin.settings.defaultReloadInterval = parseInt(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Template folder')
			.setDesc('Folder that will be ignored by one-time quotes.')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.templateFolder)
				.setValue(this.plugin.settings.templateFolder)
				.onChange(async (value) => {
					this.plugin.settings.templateFolder = value;
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h2', {text: 'Advanced'});

		new Setting(containerEl)
			.setName('Minimal quote length')
			.setDesc('If quote shorten it\'ll be skipped during scan (in characters)')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.minimalQuoteLength.toString())
				.setValue(this.plugin.settings.minimalQuoteLength.toString())
				.onChange(async (value) => {
					this.plugin.settings.minimalQuoteLength = parseInt(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Quote block format')
			.setDesc('Set your own format for quote blocks. Use {{content}} and {{author}} placeholders to place data')
			.addTextArea(text => text
				.setPlaceholder(DEFAULT_SETTINGS.quoteBlockFormat)
				.setValue(this.plugin.settings.quoteBlockFormat)
				.onChange(async (value) => {
					this.plugin.settings.quoteBlockFormat = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Clear block metadata')
			.setDesc('Set blockMetadata property to empty array (use if you have problems with old quote occurrence)')
			.addButton(btn => btn
				.setButtonText('Clear')
				.onClick(async () => {
					this.plugin.settings.blockMetadata = [];
					await this.plugin.saveSettings();
					new Notice('Your block metadata successfully cleared!')
				}));
	}
}
