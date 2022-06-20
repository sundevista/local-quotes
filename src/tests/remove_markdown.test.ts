import { removeMd } from '../libs/remove_markdown';

test('should leave a string alone without markdown', () => {
	const string = 'Javascript Developers are the best.';
	expect(removeMd(string)).toBe(string);
});

test('should strip out remaining markdown', () => {
	const string = '*Javascript* developers are the _best_.';
	const expected = 'Javascript developers are the best.';
	expect(removeMd(string)).toBe(expected);
});

test('should leave non-matching markdown markdown', () => {
	const string = '*Javascript* developers* are the _best_.';
	const expected = 'Javascript developers* are the best.';
	expect(removeMd(string)).toBe(expected);
});

test('should strip HTML', () => {
	const string = '<p>Hello World</p>';
	const expected = 'Hello World';
	expect(removeMd(string)).toBe(expected);
});

test('should strip code tags', () => {
	const string = 'In `Getting Started` we set up `something` foo.';
	const expected = 'In Getting Started we set up something foo.';
	expect(removeMd(string)).toBe(expected);
});

test('should remove emphasis', () => {
	const string = 'I italicized an *I* and it _made_ me *sad*.';
	const expected = 'I italicized an I and it made me sad.';
	expect(removeMd(string)).toBe(expected);
});

test('should remove emphasis only if there is no space between word and emphasis characters.', () => {
	const string = 'There should be no _space_, *before* *closing * _ephasis character _.';
	const expected = 'There should be no space, before *closing * _ephasis character _.';
	expect(removeMd(string)).toBe(expected);
});

test('should remove "_" emphasis only if there is space before opening and after closing emphasis characters.', () => {
	const string = '._Spaces_ _ before_ and _after _ emphasised character results in no emphasis.';
	const expected = '.Spaces _ before_ and _after _ emphasised character results in no emphasis.';
	expect(removeMd(string)).toBe(expected);
});

test('should remove double emphasis', () => {
	const string = '**this sentence has __double styling__**';
	const expected = 'this sentence has double styling';
	expect(removeMd(string)).toBe(expected);
});

test('should not remove greater than signs', () => {
	const tests = [
		{ string: '100 > 0', expected: '100 > 0' },
		{ string: '100 >= 0', expected: '100 >= 0' },
		{ string: '100>0', expected: '100>0' },
		{ string: '> 100 > 0', expected: '100 > 0' },
		{ string: '1 < 100', expected: '1 < 100' },
		{ string: '1 <= 100', expected: '1 <= 100' }
	];
	tests.forEach((test) => {
		expect(removeMd(test.string)).toBe(test.expected);
	});
});
