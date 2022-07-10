## What is quote listing
It's s way to organize your own quotes with a special syntax. You just write author's name and starting to write your 
quotes, line by line. 

Every empty line or character that doesn't match any pattern (author or quote) will break the 
quotes' sequence and plugin stops searching quotes, until the next author line appears.

## Requirements
If you create a quote listing, you need to know note's and syntax requirements:

1. A note with quote listing must have the `quotes` tag (can be changed in settings) (can be placed both in YAML 
and content)
2. Author's name must be surrounded by `:::` (see example section)
3. Quote's line must starts with `-` or `1.` (not only 1, any digit 😄), in other words, just use markdown's ordered 
or unordered lists

### Multi-line quotes
If you want to add a quote that has more than 1 line you can use tab to append a line to the previous quote line, 
so just use the syntax below:

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

In the Obsidian preview/reading mode, it looks much better and fully aligned.

## Example in edit mode
<img src="https://i.imgur.com/WPx7xZv.png" alt="example" width="50%"/> 

## Code reference
The main roles in making quote listing playing these files:

- [consts.ts](https://github.com/ka1tzyu/local-quotes/blob/master/src/consts.ts)
- [utils/scan.ts](https://github.com/ka1tzyu/local-quotes/blob/master/src/utils/scan.ts)
- [types/quote.ts](https://github.com/ka1tzyu/local-quotes/blob/master/src/types/quote.ts)
