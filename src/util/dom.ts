export function createDomLink(doc: HTMLElement, text: string, link: string): HTMLElement {
	let a = doc.createEl('a');
	a.appendText(text);
	a.href = link;

	return a;
}
