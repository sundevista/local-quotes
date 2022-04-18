import {App, Notice, Plugin, PluginSettingTab} from 'obsidian';
import findTaggedFiles from "./utils";

// Remember to rename these classes and interfaces!

interface LocalQuotesSettings {
	quoteTag: string;
	lastReload: number;
	reloadInterval: number;
	quotes: Map<string,string[]>;
}

const DEFAULT_SETTINGS: LocalQuotesSettings = {
	quoteTag: 'quotes',
	lastReload: Date.now(),
	reloadInterval: 86400,
	quotes: null,
}

export default class LocalQuotes extends Plugin {
	settings: LocalQuotesSettings;

	async onload() {
		await this.loadSettings();
	}

	onunload() {}

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
	}
}
