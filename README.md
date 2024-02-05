[DOCUMENTATION](https://sundevista.github.io/local-quotes/) / [ROADMAP](https://github.com/users/sundevista/projects/2/views/1)

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="BuyMeACoffee" width="100">](https://www.buymeacoffee.com/sundevistax)

# 📜 Local Quotes

Collect your quotes from all over the vault and embed them in different locations.

This plugin allows you to:

- Create quote listings
- Renew your quotes by any interval (minute, day, week, month)
- Apply custom classes to every quote
- Choose your own quote's format
- Use the refresh button to get new content immediately
- Stay and see how your quotes update in real-time

![demo](https://github.com/decatetsu/local-quotes/raw/master/assets/demo.gif)

## ⬇️ Installation

The plugin is available on the official community plugin marketplace. Just visit [this link](https://obsidian.md/plugins?search=local%20quotes#).

## 🧰 Maintenance mode

The plugin is in maintenance mode. All the features I wanted to implement have been successfully implemented (including your feature requests). I will no longer add new features, but I will still update the plugin in case of bugs or any other issues. So, if you have encountered a bug, you can create an [Issue](https://github.com/decatetsu/local-quotes/issues). Thank you!

## 🎯 Purpose

I started to create this plugin with only one idea: I wanted to see a note in my index that displays a new quote every day, automatically. I have a lot of quotes that I wrote myself, so I wanted a plugin that allows me to create lists of quotes and easily insert them at specified intervals, ranging from seconds to years.

## 🗒️ Quote listing

It's a simple way to collect your quotes. Just surround the quote author's name with `:::` and start writing the quotes below using a list (unordered/ordered, using `-` or `1.`). It's important to write quotes line by line because when an empty line appears, your quote series is broken. Also, your note must have a `quotes` tag (which can be changed in settings).

Visit page [Quote listings](https://decatetsu.github.io/local-quotes/terms/quote-listings/) for more details.

## ⚒️ Quote Maker

The simplest way to create a quote block is the 'Quote Maker' modal. You can summon it with the `Open Quote Maker` command. Then, just follow the instructions and press the `Insert Quote` button. Your quote block will be inserted at your cursor position (remember that you need to be in **Editing** mode).

![modal](https://github.com/decatetsu/local-quotes/raw/master/assets/modal.gif)

## ✍️ Making quote block by yourself

The plugin uses a code block and a special code block language (`localquote`) to represent your quote block. There are some settings that allow you to configure the quote block.

- `id` (required) - any string or number for quote identification (`1`, `d2f`, `my-quote1`).
- `search` (required) - search query, may only be the author's name, but you can also use [some operators](https://decatetsu.github.io/local-quotes/terms/search/).
- `refresh` (optional) - refresh interval. When this time passes, the plugin will update the quote text with another random one (`1m`, `2d`, `30s`, [more examples](#-refresh-intervals)).
- `customClass` (optional) - a class that can be added to the parent div.

````
```localquote
id 1
search Kamina, TTGL
refresh 1d
customClass my-quote-class
```
````

### 🔃 Refresh intervals

The `refresh` property uses a custom moment.js-like syntax. There are all possible variants (case-sensitive).

- `10s` - equals 10 seconds
- `10m` - equals 10 minutes
- `10h` - equals 10 hours
- `2d` - equals 2 days
- `2w` - equals 2 weeks
- `2M` - equals 2 months
- `1y` - equals 1 year

## 🗓 One-time quotes

Do you want to see a quote that you created once, for example, in a daily note? There is a simple solution - **One-time Quote**! Just set the `Template folder` in the plugin's settings and use the special code block language. When a note is placed inside the template folder, the quote won't render. But when it's outside of the template folder, it will immediately render when you open the note and will not be changed later. It's completely one-time.

This feature comes with a special modal called "One-Time Quote Maker."

Learn [this page](https://decatetsu.github.io/local-quotes/block-types/one-time-quote-block/) to get more detailed information.

````
```localquote-once
search Kamina, TTGL
```
````

## 📉 Statistics

You can get some information from Local Quote. Use the "Open Statistics" command and conduct research.

### Another useful abilities

- `Refresh local quotes for the active file` command.
- Stylize the refresh button's corner, size, and padding in the "Style Settings" plugin.
