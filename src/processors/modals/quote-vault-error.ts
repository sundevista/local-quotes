import { App, Modal } from "obsidian";
import { createDomLink } from "../../utils/dom";
import { okCloserButton } from "./functions";

export class QuoteVaultErrorModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h3", { text: "❌ Local Quote Error" });
    contentEl.createEl("p", {
      text: "After scan there is no any quote listings in your vault.",
    });

    const a: HTMLElement = createDomLink(
      contentEl,
      "wiki page",
      "https://github.com/ka1tzyu/local-quotes/wiki/How-quote-listings-work"
    );

    const p: HTMLElement = contentEl.createEl("p");
    p.appendText(
      "If you want to learn more about quote listings and understand how it works you can visit "
    );
    p.appendChild(a);
    p.appendText(".");

    okCloserButton(this);
  }

  onClose() {
    this.contentEl.empty();
  }
}
