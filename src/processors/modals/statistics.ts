import { Modal } from 'obsidian';
import LocalQuotes from '../../main';
import { getQuotesCount, okCloserButton, sortQuoteVaultEntries } from './functions';

export class StatisticsModal extends Modal {
	private readonly plugin: LocalQuotes;

	constructor(plugin: LocalQuotes) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl('h1', { text: '📉 Local Quote Statictics' });
		contentEl.createEl('p', {
			text: 'Just research and refrect. All data fresh and clear, baked just a moment ago.'
		});

		contentEl.createEl('h3', {
			text: 'Block data'
		});

		contentEl.createEl('p', {
			text: `Quantity of the block metadatas: ${this.plugin.settings.blockMetadata.length}`,
			cls: 'local-quote-statistics-p'
		});

		contentEl.createEl('p', {
			text: `Quantity of the one-time blocks: ${this.plugin.settings.oneTimeBlocks.length}`,
			cls: 'local-quote-statistics-p'
		});

		contentEl.createEl('h3', {
			text: 'Quote listings'
		});

		this.plugin.settings.quoteVault.sort(sortQuoteVaultEntries).reverse().forEach((q, i) => {
			contentEl.createEl('p', {
				text: `${i + 1}. ${q.author}: ${getQuotesCount(q)}`,
				cls: 'local-quote-statistics-p'
			});
		});

		okCloserButton(this);
	}

	onClose() {
		this.contentEl.empty();
	}
}
