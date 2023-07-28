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
  htmlTagsToSkip: new Array<string>(),
};

export function removeMd(
  md: string,
  options: RemoveMarkdownOptions | null = null
): string {
  options = options || DEFAULT_OPTIONS;

  let output: string = md || "";

  try {
    output = output
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")

      // Remove footnotes?
      .replace(/\[\^.+?\\](\\: .*?$)?/g, "")
      .replace(/\s{0,2}\[.*?\\]: .*?$/g, "")

      // Remove inline links
      .replace(
        /\[([^\]]*?)][[(].*?[\])]/g,
        options.replaceLinksWithURL ? "$2" : "$1"
      )

      // Remove blockquotes
      .replace(/^\s{0,3}>\s?/gm, "")

      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)]: (\S+)( ".*?")?\s*$/g, "")

      // Remove * emphasis
      .replace(/([*]+)(\S)(.*?\S)??\1/g, "$2$3")

      // Remove _ emphasis. Unlike *, _ emphasis gets rendered only if
      //   1. Either there is a whitespace character before opening _ and after closing _.
      //   2. Or _ is at the start/end of the string.
      .replace(/(^|\W)(_+)(\S)(.*?\S)??\2($|\W)/g, "$1$3$4$5")

      // Remove inline code
      .replace(/`(.+?)`/g, "$1")

      // Replace strike through
      .replace(/~(.*?)~/g, "$1");
  } catch (e) {
    console.error(e);
    return md;
  }

  return output;
}
