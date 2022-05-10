import {Notice, Plugin} from 'obsidian';
import {findTaggedFiles} from "./utils/scan";
import {Quote, updateQuotesVault} from "./types/quote";
import {processCodeBlock, processOneTimeCodeBlock} from "./processors/code-block";
import {DEFAULT_SETTINGS, LocalQuotesSettings, LocalQuotesSettingTab} from "./settings";
import {QuoteMakerModal} from "./processors/modals/quote-maker";
import {QuoteVaultErrorModal} from "./processors/modals/quote-vault-error";
import {OneTimeQuoteMakerModal} from "./processors/modals/one-time-quote-maker";
import {StatisticsModal} from "./processors/modals/statistics";

export default class LocalQuotes extends Plugin {
	settings: LocalQuotesSettings;
	quoteVault: Quote[];

	async onload() {
		console.log('loading Local Quotes...')
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor(
			'localquote',
			(src, el, _) => processCodeBlock(this, src, el)
		);

		this.registerMarkdownCodeBlockProcessor(
			'localquote-once',
			(src, el, ctx) => processOneTimeCodeBlock(this, src, el, ctx)
		);

		this.addSettingTab(new LocalQuotesSettingTab(this.app, this));

		this.addCommand({
			id: 'rescan-local-quotes',
			name: 'Rescan vault for local quotes',
			callback: async () => {
				await updateQuotesVault(this, findTaggedFiles(this.settings.quoteTag));
				new Notice('Your quote listings successfully updated!');
			}
		});

		this.addCommand({
			id: 'open-local-quote-block-maker',
			name: 'Open Quote Maker',
			callback: async () => {
				await updateQuotesVault(this, findTaggedFiles(this.settings.quoteTag));
				if (this.quoteVault && this.quoteVault.length > 0) {
					new QuoteMakerModal(this).open();
				} else {
					new QuoteVaultErrorModal().open();
				}
			}
		});

		this.addCommand({
			id: 'open-local-quote-one-time-block-maker',
			name: 'Open One-Time Quote Maker',
			callback: async () => {
				await updateQuotesVault(this, findTaggedFiles(this.settings.quoteTag));
				if (this.quoteVault && this.quoteVault.length > 0) {
					new OneTimeQuoteMakerModal(this).open();
				} else {
					new QuoteVaultErrorModal().open();
				}
			}
		});

		this.addCommand({
			id: 'open-local-quote-statistics',
			name: 'Open Statistics',
			callback: async () => {
				await updateQuotesVault(this, findTaggedFiles(this.settings.quoteTag));
				if (this.quoteVault && this.quoteVault.length > 0) {
					new StatisticsModal(this).open();
				} else {
					new QuoteVaultErrorModal().open();
				}
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
