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

export function sortQuoteVaultEntries(a: Quote, b: Quote): number {
	if (a.quotes.length < b.quotes.length) {
		return -1;
	}

	if(a.quotes.length > b.quotes.length) {
		return 1;
	}

	return 0;
}
