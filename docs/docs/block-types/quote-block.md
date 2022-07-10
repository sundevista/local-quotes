## Making quote block by yourself
The plugin uses code blocks and special code block language (`localquote`) to
represent your quote block. There are some settings those allow you to
configure quote block (required fields marked by `*`):

- `id`* - any string or number for quote identification (`1`, `d2f`, `my-quote1`).
- `search`* - search query, may be only author's name, but you can use
[some operators](https://ka1tzyu.github.io/local-quotes/terms/search/) too.
- `refresh` - refresh interval, when this time passes plugin
will update quote text with another random one (`1m`, `2d`, `30s`)
- `customClass` - class that can be added to parent div

````
```localquote
id 1
search Kamina, TTGL
refresh 10m
customClass my-quote-class another-class
```
````

Minimal setup:
````
```localquote
id dgnk
search Simon Figgle
```
````

### More about refresh intervals
`refresh` property uses custom moment.js like syntax. There are all possible variants (case-sensitive):

- `10s` - equals 10 seconds
- `10m` - equals 10 minutes
- `10h` - equals 10 hours
- `2d` - equals 2 days
- `2w` - equals 2 weeks
- `2M` - equals 2 months
- `1y` - equals 1 year
