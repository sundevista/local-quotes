import {Editor, MarkdownView, Modal, Notice, Setting} from "obsidian";
import {BlockMetadata} from "../types/blockmetadata";
import {getRandomQuoteId} from "../util/random";
import LocalQuotes from "../main";
import {parseBlockMetadataToCodeBlock, parseTime} from "../util/parser";

function fetchAuthorsInQuoteVault(plugin: LocalQuotes): Array<string> {
	return plugin.quoteVault.map((obj) => obj.author);
}

export class ErrorModal extends Modal {
	header: string;
	message: string;

	constructor(header: string, message: string) {
		super(app);
		this.header = header;
		this.message = message;
	}

	onOpen() {
		let {contentEl} = this;

		contentEl.createEl('h3', {text: this.header});
		contentEl.createEl('p', {text: this.message});
	}

	onClose() {
		this.contentEl.empty();
	}
}

export class QuoteMakerModal extends Modal {
	result: BlockMetadata;
	plugin: LocalQuotes;
	editor: Editor;

	constructor(plugin: LocalQuotes) {
		super(plugin.app);
		this.plugin = plugin;
		this.editor = app.workspace.getActiveViewOfType(MarkdownView).editor;
	}

	async onOpen() {
		const authorList = fetchAuthorsInQuoteVault(this.plugin);
		const randomId = getRandomQuoteId();
		let tmpReloadChar = 'd';
		let tmpReloadNum = 1;
		this.result = {
			id: randomId,
			author: authorList[0],
			reloadInterval: 86400,
			customClass: null, lastUpdate: 0, text: null
		};

		let {contentEl} = this;

		contentEl.createEl('h1', {text: 'Quote Maker'});

		new Setting(contentEl)
			.setName('Id')
			.setDesc('A way to identify your quote block, you can leave it or change to your own one')
			.addText(text => text
				.setValue(this.result.id)
				.onChange((value) => {
					if (value.length > 0) this.result.id = value;
					else this.result.id = randomId;
				}));

		new Setting(contentEl)
			.setName('Author')
			.setDesc('Choose author for your quote block')
			.addDropdown(dropdown => {
				authorList.map((author) => dropdown.addOption(author, author));
				dropdown.setValue(this.result.author);
				dropdown.onChange((value) => {
					this.result.author = value;
				})
			});

		new Setting(contentEl)
			.setName('Custom class')
			.setDesc('Set custom css class (from snippets, for example)')
			.addText(text => text
				.setValue('')
				.onChange((value) => {
					if (value.length > 0) this.result.customClass = value;
					else this.result.customClass = null;
				}));

		contentEl.createEl('h3', {text: 'Reload settings'});

		new Setting(contentEl)
			.setName('Reload interval value')
			.setDesc('Set the value of your interval (only number!)')
			.addText(text => text
				.setValue(tmpReloadNum.toString())
				.onChange((value) => {
					tmpReloadNum = parseInt(value);
					this.result.reloadInterval = parseTime(tmpReloadNum + tmpReloadChar);
				}));

		new Setting(contentEl)
			.setName('Reload interval modifier')
			.setDesc('Choose the modifier for value clarification')
			.addDropdown(dropdown => dropdown
				.addOption('s', 'second')
				.addOption('m', 'minute')
				.addOption('h', 'hour')
				.addOption('d', 'day')
				.addOption('w', 'week')
				.addOption('M', 'month')
				.addOption('y', 'year')
				.setValue(tmpReloadChar)
				.onChange((value) => {
					tmpReloadChar = value;
					this.result.reloadInterval = parseTime(tmpReloadNum + tmpReloadChar);
				})
			);

		let buttonContainer = contentEl.createEl('div');
		buttonContainer.addClass('local-quote-modal-button-container');

		new Setting(buttonContainer)
			.addButton(btn => btn
				.setButtonText('Cancel')
				.onClick(() => {
					this.onClose();
					this.close()
				}));

		new Setting(buttonContainer)
			.addButton(btn => btn
				.setButtonText('Insert Quote')
				.setCta()
				.onClick(() => {
					this.editor.replaceRange(
						parseBlockMetadataToCodeBlock(this.result, tmpReloadNum + tmpReloadChar),
						this.editor.getCursor()
					);

					this.onClose();
					this.close();

					new Notice(`Quote '${this.result.id}' from '${this.result.author}' inserted!`);
				}));
	}

	onClose() {
		this.contentEl.empty();
	}
}
