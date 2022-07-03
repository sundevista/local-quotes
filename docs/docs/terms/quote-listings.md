## What is quote listing
It's s way to organize your own quotes with a special syntax. You just write author's name and starting to write your quotes, line by line. Every empty line or character that doesn't match any pattern (author or quote) will break the quote series and stop searching quotes, until the next author match appears.

## Requirements
If you create a quote listing, you need to know note's and syntax requirements:
1. A note must have the `quotes` (can be changed in settings) tag in it content or YAML frontmatter
2. Author's line must be surrounded by `:::` (see [example](#Example))
3. Quote's line starts with `-` or `1.` (not only 1, any digit 😄), just use markdown's ordered or unordered lists

### Multi-line quotes
If you want to add a quote that has more than 1 line you can use tab to append a line to the previous quote, so just use the syntax below:
```
:::Cat:::
- — Do you really like fish?
	— Of course, stupid human!
```

```
:::Cat:::
- First line of the quote
	Next line of the quote
```

In the Obsidian preview/reading mode, it looks much better.

## Example
<img src="https://i.imgur.com/WPx7xZv.png" alt="example" width="50%"/> 

## Code reference
Code may be outdated (current code from `1.2.1`), but logic doesn't change. If you want to complete code reference - discovery repository, plugin is open source, at all.

**consts.ts**
```typescript
export const author_regexp = /:::.+:::/gm;
export const quote_regexp = /(- .+)|(\d. .+)/gm;
export const quote_long_regexp: RegExp = /^\t.+$/m;
```

**quote.ts**
```typescript
export async function updateQuotesVault(plugin: LocalQuotes, files: TFile[]): Promise<void> {
    let tmpQuoteVault: Quote[] = [];

    let current_author: string;

    for (let file of files) {
        current_author = '';

        for (let line of (await plugin.app.vault.cachedRead(file)).split('\n')) {
            let tline = line.trim();
            if (current_author && quote_regexp.test(tline) && tline.length >= plugin.settings.minimalQuoteLength) {
                // Quote case
                uploadQuote(tmpQuoteVault, current_author, tline.slice(line.indexOf(' ')));
            } else if (current_author && quote_long_regexp.test(line)
                && tline.length >= plugin.settings.minimalQuoteLength) {

                appendToLastQuote(tmpQuoteVault, clearFromMarkdownStyling(current_author), tline);
            } else if (author_regexp.test(tline)) {
                // Author case
                current_author = line.split(':::')[1].trim();
            } else {
                // Empty line or other string (author reset case)
                current_author = '';
            }
        }
    }

	plugin.settings.quoteVault = tmpQuoteVault;
	await plugin.saveSettings();
}
```
