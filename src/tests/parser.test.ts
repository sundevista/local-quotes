import {parseTime} from "../utils/parser";


/*
** PARSER TESTING
*/
test('checking parserTime()', () => {
	expect(parseTime('8j')).toBe(8);
	expect(parseTime('8')).toBe(8);
	expect(parseTime('8s')).toBe(8);
	expect(parseTime('8m')).toBe(480);
	expect(parseTime('8h')).toBe(28800);
	expect(parseTime('8d')).toBe(691200);
	expect(parseTime('8w')).toBe(4838400);
	expect(parseTime('8M')).toBe(21037968);
	expect(parseTime('8y')).toBe(252455616);
});
