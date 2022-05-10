import {Editor, MarkdownView, Modal, Notice, Setting} from "obsidian";
import {OneTimeBlock} from "../../types/one-time-block";
import LocalQuotes from "../../main";
import {createDomLink} from "../../utils/dom";
import {fetchAuthorsInQuoteVault, getValidAuthorsFromAdvancedSearch} from "../../types/quote";
import {parseOneTimeBlockToCodeBlock} from "../../utils/parser";

export class OneTimeQuoteMakerModal extends Modal {
	result: OneTimeBlock;
	plugin: LocalQuotes;
	editor: Editor;

	constructor(plugin: LocalQuotes) {
		super(plugin.app);
		this.plugin = plugin;
		this.editor = app.workspace.getActiveViewOfType(MarkdownView).editor;
	}

	async onOpen() {
		const authorList: string[] = fetchAuthorsInQuoteVault(this.plugin);
		let tmpSearch = authorList[0];
		this.result = {
			customClass: null, filename: null, search: null,
			content: {
				author: null,
				text: null,
			},
		};

		let {contentEl} = this;

		contentEl.createEl('h1', {text: '🗓 One-Time Quote Maker'});

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
			.setName('Search validator')
			.setDesc('Summons notice with validated (existent) authors')
			.addButton(btn => btn
				.setButtonText('Check')
				.setCta()
				.onClick(() => {
					new Notice('Validated authors:\n' +
						getValidAuthorsFromAdvancedSearch(this.plugin, tmpSearch).join('\n'));
				}));

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
						parseOneTimeBlockToCodeBlock(this.result),
						this.editor.getCursor()
					);

					this.onClose();
					this.close();

					new Notice(`One-time quote inserted!`);
				}));
	}

	onClose() {
		this.contentEl.empty();
	}
}
