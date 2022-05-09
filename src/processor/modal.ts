import {Editor, MarkdownView, Modal, Notice, Setting} from "obsidian";
import {BlockMetadata} from "../types/blockmetadata";
import {getRandomQuoteId} from "../util/random";
import LocalQuotes from "../main";
import {parseBlockMetadataToCodeBlock, parseTime} from "../util/parser";
import {createDomLink} from "../util/dom";
import {getValidAuthorsFromAdvancedSearch} from "../types/quote";

function fetchAuthorsInQuoteVault(plugin: LocalQuotes): Array<string> {
	return plugin.quoteVault.map((obj) => obj.author);
}

export class QuoteVaultErrorModal extends Modal {
	constructor() {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;

		contentEl.createEl('h3', {text: '❌ Local Quote Error'});
		contentEl.createEl('p', {text: 'After scan there is no any quote listings in your vault.'});

		const a: HTMLElement = createDomLink(
			contentEl,
			'wiki page',
			'https://github.com/ka1tzyu/local-quotes/wiki/How-quote-listings-work'
		);

		let p: HTMLElement = contentEl.createEl('p');
		p.appendText('If you want to learn more about quote listings and understand how it works you can visit ');
		p.appendChild(a);
		p.appendText('.');
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
		const authorList: string[] = fetchAuthorsInQuoteVault(this.plugin);
		const randomId: string = getRandomQuoteId();
		let tmpRefreshChar: string = 'd';
		let tmpRefreshNum: Number = 1;
		let tmpSearch = authorList[0];
		this.result = {
			content: {author: null, text: null},
			id: randomId, search: null, refresh: 86400, customClass: null, lastUpdate: 0
		};

		let {contentEl} = this;

		contentEl.createEl('h1', {text: '🛠️ Quote Maker'});

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
			.setName('Custom class')
			.setDesc('Set custom css class (from snippets, for example)')
			.addText(text => text
				.setValue('')
				.onChange((value) => {
					if (value.length > 0) this.result.customClass = value;
					else this.result.customClass = null;
				}));

		contentEl.createEl('h3', {text: 'Search'});
		contentEl.createEl('p',
			{
				text: '(in the quote block will be used a last edited field (\'Author\' or \'Advanced search\'))',
				cls: 'local-quote-heading-desc'
			}
		);

		new Setting(contentEl)
			.setName('Author')
			.setDesc('Choose author for your quote block (if you want choose only one)')
			.addDropdown(dropdown => {
				authorList.map((author) => dropdown.addOption(author, author));
				dropdown.setValue(tmpSearch);
				dropdown.onChange((value) => {
					tmpSearch = value;
				})
			});

		new Setting(contentEl)
			.setName('Advanced search')
			.setDesc(
				createFragment((e) => {
					let p = e.createEl('span');
					p.appendText('You can freely use \'*\' and || after reading ');
					p.appendChild(createDomLink(p, 'search guide',
						'https://github.com/ka1tzyu/local-quotes/wiki/How-to-use-search'));
				})
			)
			.addText(text => text
				.setValue(tmpSearch)
				.onChange((value) => {
					tmpSearch = value;
				}));

		new Setting(contentEl)
			.setName('Advanced search validator')
			.setDesc('Summons notice with validated (existent) authors')
			.addButton(btn => btn
				.setButtonText('Check')
				.setCta()
				.onClick(() => {
					new Notice('Validated authors:\n' +
						getValidAuthorsFromAdvancedSearch(this.plugin, tmpSearch).join('\n'));
				}));


		contentEl.createEl('h3', {text: 'Refresh settings'});

		new Setting(contentEl)
			.setName('Refresh interval value')
			.setDesc('Set the value of your interval (only number!)')
			.addText(text => text
				.setValue(tmpRefreshNum.toString())
				.onChange((value) => {
					tmpRefreshNum = parseInt(value);
					this.result.refresh = parseTime(tmpRefreshNum + tmpRefreshChar);
				}));

		new Setting(contentEl)
			.setName('Refresh interval modifier')
			.setDesc('Choose the modifier for value clarification')
			.addDropdown(dropdown => dropdown
				.addOption('s', 'second')
				.addOption('m', 'minute')
				.addOption('h', 'hour')
				.addOption('d', 'day')
				.addOption('w', 'week')
				.addOption('M', 'month')
				.addOption('y', 'year')
				.setValue(tmpRefreshChar)
				.onChange((value) => {
					tmpRefreshChar = value;
					this.result.refresh = parseTime(tmpRefreshNum + tmpRefreshChar);
				})
			);

		let buttonContainer: HTMLElement = contentEl.createEl('div');
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
					this.result.search = tmpSearch;

					this.editor.replaceRange(
						parseBlockMetadataToCodeBlock(this.result, tmpRefreshNum + tmpRefreshChar),
						this.editor.getCursor()
					);

					this.onClose();
					this.close();

					new Notice(`Quote '${this.result.id}' via '${this.result.search}' inserted!`);
				}));
	}

	onClose() {
		this.contentEl.empty();
	}
}
