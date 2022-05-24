//
//
//
// INSPIRED BY https://github.com/stiang/remove-markdown
//
//
//

interface RemoveMarkdownOptions {
	listUnicodeChar: boolean;
	stripListLeaders: boolean;
	gfm: boolean;
	useImgAltText: boolean;
	abbr: boolean;
	replaceLinksWithURL: boolean;
	htmlTagsToSkip: Array<string>;
}

const DEFAULT_OPTIONS: RemoveMarkdownOptions = {
	listUnicodeChar: false,
	stripListLeaders: true,
	gfm: true,
	useImgAltText: true,
	abbr: false,
	replaceLinksWithURL: false,
	htmlTagsToSkip: new Array<string>()

};

export function removeMd(md: string, options: RemoveMarkdownOptions | null = null): string {
	options = options || DEFAULT_OPTIONS;

	let output: string = md || '';

	// Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
	output = output.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*/gm, '');

	try {
		if (options.stripListLeaders) {
			if (options.listUnicodeChar)
				output = output.replace(/^([\s\t]*)([*\-+]|\d+\.)\s+/gm, options.listUnicodeChar + ' $1');
			else
				output = output.replace(/^([\s\t]*)([*\-+]|\d+\.)\s+/gm, '$1');
		}
		if (options.gfm) {
			output = output
			// Header
			.replace(/\n={2,}/g, '\n')
			// Fenced codeblocks
			.replace(/~{3}.*\n/g, '')
			// Strikethrough
			.replace(/~~/g, '')
			// Fenced codeblocks
			.replace(/`{3}.*\n/g, '');
		}
		if (options.abbr) {
			// Remove abbreviations
			output = output.replace(/\*\[.*\\]:.*\n/, '');
		}
		output = output
		// Remove HTML tags
		.replace(/<[^>]*>/g, '');

		let htmlReplaceRegex = new RegExp('<[^>]*>', 'g');
		if (options.htmlTagsToSkip.length > 0) {
			// Using negative lookahead. Eg. (?!sup|sub) will not match 'sup' and 'sub' tags.
			let joinedHtmlTagsToSkip = '(?!' + options.htmlTagsToSkip.join('|') + ')';

			// Adding the lookahead literal with the default regex for html. Eg./<(?!sup|sub)[^>]*>/ig
			htmlReplaceRegex = new RegExp(
				'<' +
				joinedHtmlTagsToSkip +
				'[^>]*>',
				'ig'
			);
		}

		output = output
		// Remove HTML tags
		.replace(htmlReplaceRegex, '')
		// Remove setext-style headers
		.replace(/^[=\-]{2,}\s*$/g, '')
		// Remove footnotes?
		.replace(/\[\^.+?\\](\\: .*?$)?/g, '')
		.replace(/\s{0,2}\[.*?\\]: .*?$/g, '')
		// Remove images

		// .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, options.useImgAltText ? '$1' : '')
		// // Remove inline links
		// .replace(/\[([^\]]*?)\][\[\(].*?[\]\)]/g, options.replaceLinksWithURL ? '$2' : '$1')
		// // Remove blockquotes
		// .replace(/^\s{0,3}>\s?/gm, '')
		// // .replace(/(^|\n)\s{0,3}>\s?/g, '\n\n')
		// // Remove reference-style links?
		// .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
		// // Remove atx-style headers
		// .replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} #{0,}(\n)?\s{0,}$/gm, '$1$2$3')
		// // Remove * emphasis
		// .replace(/([\*]+)(\S)(.*?\S)??\1/g, '$2$3')

		.replace(/!\[(.*?)][\[(].*?[\])]/g, options.useImgAltText ? '$1' : '')
		// Remove inline links
		.replace(/\[([^\]]*?)][\[(].*?[\])]/g, options.replaceLinksWithURL ? '$2' : '$1')
		// Remove blockquotes
		.replace(/^\s{0,3}>\s?/gm, '')
		// .replace(/(^|\n)\s{0,3}>\s?/g, '\n\n')
		// Remove reference-style links?
		.replace(/^\s{1,2}\[(.*?)]: (\S+)( ".*?")?\s*$/g, '')
		// Remove atx-style headers
		.replace(/^(\n)?\s*#{1,6}\s+| *(\n)?\s*#* #*(\n)?\s*$/gm, '$1$2$3')
		// Remove * emphasis
		.replace(/([*]+)(\S)(.*?\S)??\1/g, '$2$3')

		// Remove _ emphasis. Unlike *, _ emphasis gets rendered only if
		//   1. Either there is a whitespace character before opening _ and after closing _.
		//   2. Or _ is at the start/end of the string.
		.replace(/(^|\W)(_+)(\S)(.*?\S)??\2($|\W)/g, '$1$3$4$5')
		// Remove code blocks
		.replace(/(`{3,})(.*?)\1/gm, '$2')
		// Remove inline code
		.replace(/`(.+?)`/g, '$1')
		// Replace strike through
		.replace(/~(.*?)~/g, '$1');
	} catch (e) {
		console.error(e);
		return md;
	}

	return output;
}
