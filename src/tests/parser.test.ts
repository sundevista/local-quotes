import {parseTime} from "../util/parser";

test('parse 8m conversation equal 480', () => {
	expect(parseTime('8m')).toBe(480);
});
