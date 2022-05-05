import {BlockMetadata} from "../main";
import {
	codeblock_author_regexp,
	codeblock_customClass_regexp,
	codeblock_id_regexp,
	codeblock_reloadInterval_regexp
} from "../consts";

export function parseCodeBlock(content: string): BlockMetadata {
	let id = null, author = null, reloadInterval = null, customClass = null;

	for (let line of content.split('\n')) {
		console.log(line);

		if (line.match(codeblock_id_regexp)) id = line.split('id ')[1];
		if (line.match(codeblock_author_regexp)) author = line.split('author ')[1];
		if (line.match(codeblock_reloadInterval_regexp)) reloadInterval = parseInt(line.split('reload ')[1]);
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
