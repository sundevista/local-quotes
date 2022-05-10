# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
