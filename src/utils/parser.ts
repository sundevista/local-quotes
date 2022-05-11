import {BlockMetadata} from "../types/block-metadata";
import * as Showdown from 'showdown';
import {
	code_block_search_regexp,
	code_block_customClass_regexp,
	code_block_id_regexp,
	code_block_refreshInterval_regexp, sec_in_day, sec_in_hour, sec_in_minute, sec_in_month, sec_in_week, sec_in_year
} from "../consts";
import {ShowdownExtension} from "showdown";
import {OneTimeBlock} from "../types/one-time-block";

export function clearFromMarkdownStyling(src: string): string {
	const showdown = new Showdown.Converter();
	src = showdown.makeHtml(src);

	const blacklist = ['<strong>', '</strong>', '<em>', '</em>', '<p>', '</p>'];

	for (let el of blacklist) {
		src = src.split(el).join('');
	}

	return src;
}

export function clearCodeFromClosableTag(src: string, tag: string): string {
	for (let el of [`<${tag}>`, `</${tag}>`]) {
		src = src.split(el).join('');
	}
	return src;
}

export function parseMdToHtml(src: string): string {
	const highlightExt: ShowdownExtension = {
		type: 'lang',
		regex: /==.+==/,
		replace: (s: string) => {
			return s.replace('==', '<mark>').replace('==', '</mark>');
		}
	}

	const conv = new Showdown.Converter({
		extensions: [highlightExt],
	});
	return conv.makeHtml(src);
}

export function parseOneTimeBlockToCodeBlock(blockMetadata: OneTimeBlock): string {
	let result: Array<string> = [];

	result.push('```localquote-once');
	result.push(`search ${blockMetadata.search}`);
	blockMetadata.customClass && result.push(`customClass ${blockMetadata.customClass}`);
	result.push('```');

	return result.join('\n');
}

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

export function parseOneTimeCodeBlock(content: string): OneTimeBlock {
	let result: OneTimeBlock = {filename: null, content: null, customClass: null, search: null};

	for (let line of content.split('\n')) {
		if (code_block_search_regexp.test(line)) result.search = line.split('search ')[1];
		if (code_block_customClass_regexp.test(line)) result.customClass = line.split('customClass ')[1];
	}

	return result;
}

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