import {BlockMetadata} from "../types/blockmetadata";
import {
	codeblock_author_regexp,
	codeblock_customClass_regexp,
	codeblock_id_regexp,
	codeblock_reloadInterval_regexp, sec_in_day, sec_in_hour, sec_in_minute, sec_in_month, sec_in_week, sec_in_year
} from "../consts";

export function parseCodeBlock(content: string): BlockMetadata {
	let id = null, author = null, reloadInterval = null, customClass = null;

	for (let line of content.split('\n')) {
		if (line.match(codeblock_id_regexp)) id = line.split('id ')[1];
		if (line.match(codeblock_author_regexp)) author = line.split('author ')[1];
		if (line.match(codeblock_reloadInterval_regexp)) reloadInterval = parseTime(line.split('reload ')[1]);
		if (line.match(codeblock_customClass_regexp)) customClass = line.split('class ')[1];
	}

	return {
		id: id,
		author: author,
		text: null,
		customClass: customClass,
		lastUpdate: 0,
		reloadInterval: reloadInterval,
	};
}

function parseTime(str: string): number {
	// Last letter
	const letter = str.slice(-1);

	// Number value
	const value = parseInt(str.slice(0, -1));

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
	}
}
