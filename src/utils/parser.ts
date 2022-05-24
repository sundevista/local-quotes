import { BlockMetadata } from '../types/block-metadata';
import {
	code_block_customClass_regexp,
	code_block_id_regexp,
	code_block_refreshInterval_regexp,
	code_block_search_regexp,
	sec_in_day,
	sec_in_hour,
	sec_in_minute,
	sec_in_month,
	sec_in_week,
	sec_in_year
} from '../consts';
import { OneTimeBlock } from '../types/one-time-block';

/*
 * Parses from {@link OneTimeBlock} to it code block representation
 *
 * @param oneTimeBlock - object to be parsed
 *
 * @returns code block representation of given `oneTimeBlock`
 */
export function parseOneTimeBlockToCodeBlock(oneTimeBlock: OneTimeBlock): string {
	let result: Array<string> = [];

	result.push('```localquote-once');
	result.push(`search ${oneTimeBlock.search}`);
	oneTimeBlock.customClass && result.push(`customClass ${oneTimeBlock.customClass}`);
	result.push('```');

	return result.join('\n');
}

/*
 * Parses from {@link BlockMetadata} to it code block representation
 *
 * @param blockMetadata - object to be parsed
 *
 * @returns code block representation of given `blockMetadata`
 */
export function parseBlockMetadataToCodeBlock(blockMetadata: BlockMetadata, refreshStr: string): string {
	let result: Array<string> = [];

	result.push('```localquote');
	result.push(`id ${blockMetadata.id}`);
	result.push(`search ${blockMetadata.search}`);
	result.push(`refresh ${refreshStr}`);
	blockMetadata.customClass && result.push(`customClass ${blockMetadata.customClass}`);
	result.push('```');

	return result.join('\n');
}

/*
 * Parses code block to {@link BlockMetadata} object representation
 *
 * @param content - string to be parsed
 *
 * @returns code block representation of `content`
 */
export function parseCodeBlock(content: string): BlockMetadata {
	let result: BlockMetadata = {
		content: null, customClass: null, id: null, lastUpdate: 0, refresh: null, search: null
	};

	for (let line of content.split('\n')) {
		if (code_block_id_regexp.test(line)) result.id = line.split('id ')[1];
		if (code_block_search_regexp.test(line)) result.search = line.split('search ')[1];
		if (code_block_refreshInterval_regexp.test(line)) result.refresh = parseTime(line.split('refresh ')[1]);
		if (code_block_customClass_regexp.test(line)) result.customClass = line.split('customClass ')[1];
	}

	return result;
}

/*
 * Parses code block to {@link OneTimeBlock} object representation
 *
 * @param content - string to be parsed
 *
 * @returns code block representation of `content`
 */
export function parseOneTimeCodeBlock(content: string): OneTimeBlock {
	let result: OneTimeBlock = { filename: null, content: null, customClass: null, search: null };

	for (let line of content.split('\n')) {
		if (code_block_search_regexp.test(line)) result.search = line.split('search ')[1];
		if (code_block_customClass_regexp.test(line)) result.customClass = line.split('customClass ')[1];
	}

	return result;
}

/*
 * Parses refresh interval string to the seconds
 *
 * @param str - refresh interval
 *
 * @returns refresh time in seconds
 */
export function parseTime(str: string): number {
	// Last letter
	const letter: string = str.slice(-1);

	// Number value
	const value: number = parseInt(str);

	if (Number.isNaN(value)) return null;

	switch (letter) {
		case 's':
			return value;
		case 'm':
			return value * sec_in_minute;
		case 'h':
			return value * sec_in_hour;
		case 'd':
			return value * sec_in_day;
		case 'w':
			return value * sec_in_week;
		case 'M':
			return value * sec_in_month;
		case 'y':
			return value * sec_in_year;
		default:
			return value;
	}
}
