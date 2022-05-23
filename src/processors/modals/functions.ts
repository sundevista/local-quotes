import {Modal, Setting} from "obsidian";
import {Quote} from "../../types/quote";

export function okCloserButton(modal: Modal): void {
	let buttonContainer: HTMLElement = modal.contentEl.createEl('div');
	buttonContainer.addClass('local-quote-modal-button-container');

	new Setting(buttonContainer)
		.addButton(btn => btn
			.setButtonText('OK')
			.setCta()
			.onClick(() => {
				modal.onClose();
				modal.close();
			}));
}

export function getQuotesCount(quote: Quote): number {
	let cnt = 0;

	for (let file of quote.files) {
		cnt += file.quotes.length
	}

	return cnt;
}

export function sortQuoteVaultEntries(a: Quote, b: Quote): number {
	if (getQuotesCount(a) < getQuotesCount(b)) return -1;
	if (getQuotesCount(a) > getQuotesCount(b)) return 1;
	return 0;
}
