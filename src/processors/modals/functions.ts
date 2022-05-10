import {Modal, Setting} from "obsidian";

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
