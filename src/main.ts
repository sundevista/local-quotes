import {App, Plugin, PluginSettingTab, Setting} from 'obsidian';
import {findTaggedFiles} from "./util/scan";
import {updateQuotesVault} from "./processor/quote";
import {parseCodeBlock} from "./util/parser";

export interface BlockMetadata {
	id: string;
	author: string;
	text: string;
	lastUpdate: number;
	reloadInterval: number;
	customClass: string;
}

interface Quote {
	author: string;
	quotes: string[];
}

interface LocalQuotesSettings {
	quoteTag: string;
	defaultReloadInterval: number;
	eventCheckInterval: number;
	minimalQuoteLength: number;
	showReloadButton: boolean;
	blockMetadata: BlockMetadata[];
}

const DEFAULT_SETTINGS: LocalQuotesSettings = {
	quoteTag: 'quotes',
	defaultReloadInterval: 86400,
	eventCheckInterval: 120,
	minimalQuoteLength: 5,
	showReloadButton: false,
	blockMetadata: new Array<BlockMetadata>(),
}

export default class LocalQuotes extends Plugin {
	settings: LocalQuotesSettings;
	quoteVault: Quote[];

	async onload() {
		console.log('loading Local Quotes...')
		await this.loadSettings();

		this.addSettingTab(new LocalQuotesSettingTab(this.app, this));

		console.log(parseCodeBlock("```\nid dsgbkj4jk\nauthor Simon Dziha\n```"));

		this.addCommand({
			id: 'rescan-local-quotes',
			name: 'Rescan vault for local quotes',
			callback: async() => {
				await updateQuotesVault(this, findTaggedFiles(this.app, this.settings.quoteTag))
			}
		});
	}

	async onunload() {
		await this.saveSettings();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class LocalQuotesSettingTab extends PluginSettingTab {
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
			.setName('Reload interval')
			.setDesc('You can set default reload interval and miss corresponding field in codeblock (in seconds)')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.defaultReloadInterval.toString())
				.setValue(this.plugin.settings.defaultReloadInterval.toString())
				.onChange(async (value) => {
					this.plugin.settings.defaultReloadInterval = parseInt(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Show reload button (unavailable)')
			.setDesc('Turn off if you want to hide reload button')
			.addToggle(state => state
				.setDisabled(true)
				.setValue(this.plugin.settings.showReloadButton)
				.onChange(async (value) => {
					this.plugin.settings.showReloadButton = value;
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h2', {text: 'Advanced'});

		new Setting(containerEl)
			.setName('Event check interval')
			.setDesc('How often plugin should check time to update quote codeblocks (in seconds)')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.eventCheckInterval.toString())
				.setValue(this.plugin.settings.eventCheckInterval.toString())
				.onChange(async (value) => {
					this.plugin.settings.eventCheckInterval = parseInt(value);
					await this.plugin.saveSettings();
				}));

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
	}
}
