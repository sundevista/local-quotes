[DOCUMENTATION](https://decatetsu.github.io/local-quotes/) / [ROADMAP](https://trello.com/b/MqYn6s7h/obsidian-local-quotes)

# 📜 Local Quotes
Collect your quotes from all over the vault and embed them in different locations.

This plugin allows you to:
- Create quote listings
- Renew your quotes by any interval (minute, day, week, month)
- Apply custom classes to every quote
- Choose your own quote's format
- Use refresh button to get new content immediately

![demo](https://github.com/ka1tzyu/local-quotes/raw/master/assets/demo.gif)

## 🎯 Purpose
I started to create this plugin with only one idea — I wanted to see in my Index note
the quote, that reloads every day automatically. I have a lot of quotes those written myself, so I 
wanted plugin that allows to create lists of quotes and simple way to insert them
with specified interval, from seconds to years.

## 🗒️ Quote listing
It's a simple way to collect your quotes. Just surround quote's author's name with
`:::` and start to write the quotes below using list (unordered/ordered, using `-` or `1.`).
It's important to write quotes line by line, because when empty line appears
your quote series is breaking. Also, your note must have `quotes` tag (can be 
changed in settings).

Visit page [Quote listings](https://ka1tzyu.github.io/local-quotes/terms/quote-listings/) for more details.

## ⚒️ Quote Maker
The simplest way to create a quote block is 'Quote Maker' modal. You can summon it with
`Open Quote Maker` command. Then just follow instruction and press `Insert Quote`
button. Then your quote block'll be inserted in your cursor position (remember that
you need to be in **Editing** mode).

![modal](https://github.com/ka1tzyu/local-quotes/raw/master/assets/modal.gif)

## ✍️ Making quote block by yourself
Plugin using codeblock and special codeblock language (`localquote`) to
represent your quote block. There are some settings those allow you to
configure quote block:
- `id` (required) - any string or number for quote identification (`1`,
`d2f`, `my-quote1`).
- `search` (required) - search query, may be only author's name, but you can use 
[some operators](https://ka1tzyu.github.io/local-quotes/terms/search/) too.
- `refresh` (optional) - refresh interval, when this time passes plugin
will update quote text with another random one (`1m`, `2d`, `30s`, [more 
examples](#-refresh-intervals))
- `customClass` (optional) - class that can be added to parent div

````
```localquote
id 1
search Kamina, TTGL
refresh 1d
customClass my-quote-class
```
````

### 🔃 Refresh intervals
`refresh` property uses custom moment.js like syntax. There are all possible
variants (case-sensitive):
- `10s` - equals 10 seconds
- `10m` - equals 10 minutes
- `10h` - equals 10 hours
- `2d` - equals 2 days
- `2w` - equals 2 weeks
- `2M` - equals 2 months
- `1y` - equals 1 year

## 🗓 One-time quotes
Do you want to see quote that creating once, for example, in daily note? There is a simple
solution — **One-time Quote**! Just set `Template folder` in the plugin's settings and
use special code block language. When note placed inside template folder, quote won't
render. But at the time when it's outside of template folder, it immediately renders
when you open note, and will not be changed later. Totally one-time. 

This feature comes with special modal `One-Time Quote Maker`.

Learn [this page](https://ka1tzyu.github.io/local-quotes/block-types/one-time-quote-block/) to get more detailed information.

````
```localquote-once
search Kamina, TTGL
```
````

## 📉 Statistics
You can get some info from Local Quote. Use `Open Statistics` command and research.

### Another useful abilities
- `Refresh local quotes for active file` command
- Stylize refresh button's corner, size and padding in `Style Settings` plugin

## ⏫ Future updates
You can see what I am doing at the moment [here](https://trello.com/b/MqYn6s7h/obsidian-local-quotes). If you want some feature to be made first, like the first message in
this feature's issue, I'll pay attention. Also, you can see unreleased but already done features and changes in [CHANGELOG](CHANGELOG.md), they'll be available in the next release.

## ℹ️ Help
If you have any question, feature idea, or you caught a bug, you can create 
[Issue](https://github.com/ka1tzyu/local-quotes/issues) and discuss it with me. I'm beginner so if you have more
experience you can also do [Pull Request](https://github.com/ka1tzyu/local-quotes/pulls.com).

If you want to donate, you can use it:

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="BuyMeACoffee" width="100">](https://www.buymeacoffee.com/ka1tzyu)
