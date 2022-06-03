# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.3] - 2022/06/03
## Fixed
- Dataview update blocked rendering some lines of quote

## [1.3.2] - 2022/06/01
## Changed
- `onFileModify` event from file's `modify` to metadata's `changed`

## Removed
- Some reduntant code

## [1.3.1] - 2022/05/28
## Fixed
- Error on startup with failed load

## [1.3.0] - 2022/05/24
## Added
- Ability to automatically update quote listing when file modifies, so you don't need to manually rescan it
- Setting for automatically quote listing update (enabled by default)

## Removed
- Unnecessary `quoteScanOnBlockRender` setting

## [1.2.10] - 2022/05/19
### Changed
- Replace showdown to Obsidian's `renderMarkdown()`, so plugin size reduced to ~35KB 
([related task](https://github.com/ka1tzyu/local-quotes/projects/1#card-82152964))

### Fixed
- Some fixes from [here](https://github.com/ka1tzyu/local-quotes/projects/1#card-82152799)

## [1.2.9] - 2022/05/13
### Fixed
- Multi-line quotes now work properly 
[wiki reference](https://github.com/ka1tzyu/local-quotes/wiki/How-quote-listings-work#-multi-line-quotes)

## [1.2.8] - 2022/05/12
### Fixed
- `innerHtml` <script> execution vulnerability

## [1.2.7] - 2022/05/12
### Fixed
- Grammar issues and setting name

## [1.2.6] - 2022/05/12
### Fixed
- Quotes now in settings, so you can view your first loaded note's quote block without page reload

## [1.2.5] - 2022/05/11
### Fixed
- On slow devices `onLayoutReady` does it work slowly than page render

## [1.2.4] - 2022/05/11
### Added
- Ability to configure quoteVault updating while code block renders

### Changed
- Some movements in settings

### Fixed
- Special notice on `*` validating instead of no authors notice warning
- Quote duplicating

## [1.2.3] - 2022/05/11
### Fixed
- Remove unnecessary notice (dev)

## [1.2.2] - 2022/05/10
### Fixed
- Now quote slicing based on first space position rathar than persistent position

## [1.2.1] - 2022/05/10
### Fixed
- Now author's may contain words in any language

## [1.2.0] - 2022/05/10
### Added
- New modal - `Local Quote Statistics` with basic local quotes' stats
- Ability to inherit listing's style in quote block (enable via settings, off by default)

### Changed
- Danger setting got their own settings category - `Danger Zone`

### Fixed
- You can use markdown (bold/italic style) to your quote's listings headers (`:::**Author**:::`)

## [1.1.1] - 2022/05/10
### Changed
- Auto generated id's length moved to settings
- Search validator now returns special message if there is no valid authors in search

### Fixed
- Constant regular expressions improvements

## [1.1.0] - 2022/05/09
### Added
- Ability to use markdown (highlight too) inside quote's format setting and quotes' listings
- New setting that allows to validate advanced search
- [One-time quote](https://github.com/ka1tzyu/local-quotes/wiki/What-is-one-time-quote%3F) — brand-new quote type
- New setting — `Clear one-time blocks`
- New modal — `One-Time Quote Maker`
- New command — `Open One-Time Quote Maker`

### Removed
- Unnecessary `reload button` setting

### Fixed
- Notice from Quote Maker now return `search` rather than `null` from uncreated content

## [1.0.0] - 2022/05/08
### BREAKING CHANGE
- New BlockMetadata design(read
[this wiki](https://github.com/ka1tzyu/local-quotes/wiki/How-to-switch-from-%600.x.x%60-to-%601.x.x%60)
to switch from `0.x.x` to `1.x.x`)

### Added
- Error model that occurs when you summon `Quote Maker` with no quote listings
- [Wiki page](https://github.com/ka1tzyu/local-quotes/wiki/How-quote-listings-work) about quote listing (and refer to it in error modal)
- Search possibilities ([wiki](https://github.com/ka1tzyu/local-quotes/wiki/How-to-use-search))

### Changed
- Modal styling (emojis)

### Fixed
- More space between buttons in `Quote Maker`

## [0.2.1] - 2022/05/08
### Fixed
- Plugin now searches tag in any position and source (frontmatter) (#12)

### Changed
- Modal name now is Quote Maker
- Some code improvements

## [0.2.0] - 2022/05/07
### Added
- Ability to change quote format in settings
- All-in-one 'Quote Maker' modal that simplify the way of quote block making ([more info](https://github.com/ka1tzyu/local-quotes#%EF%B8%8Fquote-maker))

### Fixed
- Some grammar issues in [README](README.md)

## [0.1.1] - 2022/05/06
### Added
- Setting with ability to clear blockMetadata

### Fixed
- `customClass` behavior
- Some notices for better user experience

## [0.1.0] - 2022/05/06
### Added
- Basic functionality described in [README](README.md)
