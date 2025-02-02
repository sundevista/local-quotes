import LocalQuotes from "../main";
import { parseCodeBlock } from "../utils/parser";
import { getCurrentSeconds } from "../utils/date";
import { searchQuote } from "./quote";

export interface BlockMetadataContent {
  author: string;
  text: string;
}

export interface BlockMetadata {
  id: string;
  search: string;
  content: BlockMetadataContent;
  customClass: string;
  refresh: number;
  lastUpdate: number;
}

async function makeBlockMetadata(
  plugin: LocalQuotes,
  rawBlockMetadata: BlockMetadata
): Promise<BlockMetadata> {
  rawBlockMetadata.content = searchQuote(
    plugin.settings.quoteVault,
    rawBlockMetadata.search,
    plugin.settings.useWeightedRandom
  );
  rawBlockMetadata.lastUpdate = getCurrentSeconds();

  plugin.settings.blockMetadata.push(rawBlockMetadata);

  await plugin.saveSettings();

  return rawBlockMetadata;
}

async function updateBlockMetadata(
  plugin: LocalQuotes,
  rawBlockMetadata: BlockMetadata,
  bmIdx: number
): Promise<BlockMetadata> {
  const prevBm: BlockMetadata = plugin.settings.blockMetadata[bmIdx];

  // Fields updating
  if (prevBm.search !== rawBlockMetadata.search) {
    plugin.settings.blockMetadata[bmIdx].search = rawBlockMetadata.search;
    plugin.settings.blockMetadata[bmIdx].content = searchQuote(
      plugin.settings.quoteVault,
      rawBlockMetadata.search,
      plugin.settings.useWeightedRandom
    );
  }
  if (prevBm.customClass !== rawBlockMetadata.customClass) {
    plugin.settings.blockMetadata[bmIdx].customClass =
      rawBlockMetadata.customClass;
  }
  if (prevBm.refresh !== rawBlockMetadata.refresh) {
    plugin.settings.blockMetadata[bmIdx].refresh = rawBlockMetadata.refresh;
    plugin.settings.blockMetadata[bmIdx].content = searchQuote(
      plugin.settings.quoteVault,
      rawBlockMetadata.search,
      plugin.settings.useWeightedRandom
    );
  }

  // Update quote
  const refreshInterval =
    plugin.settings.blockMetadata[bmIdx].refresh === null
      ? plugin.settings.defaultReloadInterval
      : plugin.settings.blockMetadata[bmIdx].refresh;

  if (
    plugin.settings.blockMetadata[bmIdx].lastUpdate + refreshInterval <
    getCurrentSeconds()
  ) {
    plugin.settings.blockMetadata[bmIdx].content = searchQuote(
      plugin.settings.quoteVault,
      rawBlockMetadata.search,
      plugin.settings.useWeightedRandom
    );
    plugin.settings.blockMetadata[bmIdx].lastUpdate = getCurrentSeconds();
  }

  await plugin.saveSettings();

  return plugin.settings.blockMetadata[bmIdx];
}

export async function selectBlockMetadata(
  plugin: LocalQuotes,
  source: string
): Promise<BlockMetadata> {
  const tmpBm: BlockMetadata = parseCodeBlock(source);
  const idx: number = plugin.settings.blockMetadata.findIndex(
    (e) => e.id === tmpBm.id
  );

  // If author and/or id aren't set
  if (!(tmpBm.id && tmpBm.search) || plugin.settings.quoteVault.length === 0) {
    return {
      content: {
        author: "Local Quotes",
        text: "You caught an error! Check if quote's author exists. If you can't understand what is wrong you can write an issue on GitHub",
      },
      customClass: null,
      id: null,
      lastUpdate: 0,
      refresh: null,
      search: null,
    };
  } else {
    if (idx >= 0) return updateBlockMetadata(plugin, tmpBm, idx);
    else return makeBlockMetadata(plugin, tmpBm);
  }
}
