import {App, Plugin, PluginSettingTab, Setting} from 'obsidian';

interface BlockMetadata {
	id: number;
	author: string;
	lastUpdate: number;
	reloadInterval: number;
	customClass: string;
}

interface LocalQuotesSettings {
	quoteTag: string;
	defaultReloadInterval: number;
	showReloadButton: boolean;
	quoteVault: Map<string,string[]>;
	blockMetadata: BlockMetadata[];
}

const DEFAULT_SETTINGS: LocalQuotesSettings = {
	quoteTag: 'quotes',
	defaultReloadInterval: 86400,
	showReloadButton: false,
	quoteVault: new Map<string, string[]>(),
	blockMetadata: new Array<BlockMetadata>(),
}

export default class LocalQuotes extends Plugin {
	settings: LocalQuotesSettings;

	async onload() {
		await this.loadSettings();
		await this.addSettingTab(new LocalQuotesSettingTab(this.app, this));
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

		new Setting(containerEl)
			.setName('Quote tag')
			.setDesc('Tag name that will be used for searching notes with quotes')
			.addText(text => text
				.setValue(this.plugin.settings.quoteTag)
				.onChange(async (value) => {
					this.plugin.settings.quoteTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Reload interval')
			.setDesc('You can set default reload interval and miss corresponding field in codeblock')
			.addText(text => text
				.setValue(this.plugin.settings.defaultReloadInterval.toString())
				.onChange(async (value) => {
					this.plugin.settings.defaultReloadInterval = parseInt(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Show reload button')
			.setDesc('Turn off if you want to hide reload button')
			.addToggle(state => state
				.setValue(this.plugin.settings.showReloadButton)
				.onChange(async (value) => {
					this.plugin.settings.showReloadButton = value;
					await this.plugin.saveSettings();
				}));
	}
}
