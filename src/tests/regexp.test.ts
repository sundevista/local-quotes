import {
	author_regexp, code_block_customClass_regexp,
	code_block_id_regexp,
	code_block_refreshInterval_regexp,
	code_block_search_regexp,
	quote_regexp,
	search_regexp
} from "../consts";

// @ts-suppress
const testRegExp = (str: string, regexp: RegExp): boolean => regexp.test(str);

/*
** TESTING CONSTANTS
*/
test('checking author_regexp', () => {
	const cases = [
		[':::Author:::', true],
		[':::Long Author Name:::', true],
		[':::Author12:::', true],
		[':::Author 12:::', true],
		[':::Author 12 :::', true],
		[':::Author, From:::', true],
		[':::Author, From. Full Source:::', true],
		['::::Author:::', false],
		['::Author:::', false],
		[' :::Author:::', false],
		[':::Author::: ', false],
	];

	for (let _case of cases) {
		expect(testRegExp(_case[0].toString(), author_regexp)).toBe(_case[1]);
	}
});

test('checking quote_regexp', () => {
	const cases = [
		['- Usual quote string', true],
		['1. Numbered quote', true],
		['9999999. Big numbered quote', true],
		['- Quote **with** some ==styling *features*==', true],
		['- "Quote in curls"', true],
		['-- Wrong styled quote', false],
		['.1 Wrong styled quote', false],
		['Wrong styled quote', false],
		[' - Wrong styled quote', false],
	];

	for (let _case of cases) {
		expect(testRegExp(_case[0].toString(), quote_regexp)).toBe(_case[1]);
	}
});

test('checking search_regexp', () => {
	const cases = [
		['Kamina, TTGL', true],
		['A very long, author. With dot', true],
		['First Person || Second Person', true],
		['First Person, with comma. and dot || Second Person || And, finally, third', true],
		['Person', true],
		['Using or|| with mistake', false],
		['Using wrong && operator', false],
		['Using wrong symbols!', false],
	];

	for (let _case of cases) {
		expect(testRegExp(_case[0].toString(), search_regexp)).toBe(_case[1]);
	}
});

test('checking code_block_id_regexp', () => {
	const cases = [
		['id 1', true],
		['id NFGHS', true],
		['id my-quote-id', true],
		['id my-quote_id-1', true],
		['id NX-SERIAL_DOM', true],
		['id with space', false],
		['id with!wrong-char', false],
		[' id wrong_indent', false],
		['idx wrong_field-name', false],
	];

	for (let _case of cases) {
		expect(testRegExp(_case[0].toString(), code_block_id_regexp)).toBe(_case[1]);
	}
});

test('checking code_block_search_regexp', () => {
	const cases = [
		['search Kamina, TTGL', true],
		['search A very long, author. With dot', true],
		['search First Person || Second Person', true],
		['search First Person, with comma. and dot || Second Person || And, finally, third', true],
		['search Person', true],
		['search Using or|| with mistake', false],
		['search Using wrong && operator', false],
		['search Using wrong symbols!', false],
		[' search wrong indent', false],
		['search Using wrong symbols!', false],
		['searches Using wrong field name', false],
	];

	for (let _case of cases) {
		expect(testRegExp(_case[0].toString(), code_block_search_regexp)).toBe(_case[1]);
	}
});

test('checking code_block_refreshInterval_regexp', () => {
	const cases = [
		['refresh 1d', true],
		['refresh 10s', true],
		['refresh 1000y', true],
		['refresh 2M', true],
		['refresh 1x', false],
		['refresh wrong-value', false],
		['refresh 1', false],
		[' refresh 10s', false],
		['refresh 25!', false],
		['refreshes 10s', false],
	];

	for (let _case of cases) {
		expect(testRegExp(_case[0].toString(), code_block_refreshInterval_regexp)).toBe(_case[1]);
	}
});

test('checking code_block_customClass_regexp', () => {
	const cases = [
		['customClass class', true],
		['customClass class_name', true],
		['customClass class-name_1', true],
		['customClass .class-with-dot', true],
		['customClass ..two_dots_now_allowed', false],
		['customClass wrong-char!', false],
		[' customClass class', false],
		['customClasses class', false],
	];

	for (let _case of cases) {
		expect(testRegExp(_case[0].toString(), code_block_customClass_regexp)).toBe(_case[1]);
	}
});
