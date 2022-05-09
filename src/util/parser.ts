import {BlockMetadata} from "../types/blockmetadata";
import * as Showdown from 'showdown';
import {
	codeblock_author_regexp,
	codeblock_customClass_regexp,
	codeblock_id_regexp,
	codeblock_reloadInterval_regexp, sec_in_day, sec_in_hour, sec_in_minute, sec_in_month, sec_in_week, sec_in_year
} from "../consts";
import {ShowdownExtension} from "showdown";

export function parseMdToHtml(src: string): string {
	const highlightExt: ShowdownExtension = {
		type: 'lang',
			regex: /==.+==/gm,
		replace: (s: string) => {
			return s.replace('==', '<mark>')
				.replace('==', '</mark>');
		}
	}

	const conv = new Showdown.Converter({
		extensions: [highlightExt],
	});
	return conv.makeHtml(src);
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
		content: null, customClass: null, id: null, lastUpdate: 0, refresh: null, search: null};

	for (let line of content.split('\n')) {
		if (line.match(codeblock_id_regexp)) result.id = line.split('id ')[1];
		if (line.match(codeblock_author_regexp)) result.search = line.split('search ')[1];
		if (line.match(codeblock_reloadInterval_regexp)) result.refresh = parseTime(line.split('refresh ')[1]);
		if (line.match(codeblock_customClass_regexp)) result.customClass = line.split('customClass ')[1];
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
