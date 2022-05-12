/*
 * Creates {@link HTMLElement} `<a>` with given text and link
 *
 * @param doc - root {@link HTMLElement} for creating another one
 * @param text - text inside the `<a>`
 * @param link - link to be placed in `href`
 *
 * @returns `<a>` elements with given params
 */
export function createDomLink(doc: HTMLElement, text: string, link: string): HTMLElement {
	let a: HTMLAnchorElement = doc.createEl('a');
	a.appendText(text);
	a.href = link;

	return a;
}

/*
 * Check string for `innerHtml` vulnerability
 *
 * @param str - string to be checked
 *
 * @returns `true` if string is weak, else `false`
 */
export function isStringWeakForInnerHtmlVulnerability(str: string): boolean {
	return str.contains('<script>') && str.contains('</script>');

}
