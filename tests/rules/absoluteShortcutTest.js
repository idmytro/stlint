const { Linter, Content } = require("stlint");
const { expect } = require("chai");
const { AbsoluteShortcut } = require("../../rules/absoluteShortcut");

extendsRule(AbsoluteShortcut);

let wrongContent = '.tab\n\tposition absolute\n\ttop 10px\n\tleft 20px\n\tright 10px';

describe('Test absoluteShortcut', () => {
	it('Should throw error position absolute', () => {
		const rule = new AbsoluteShortcut({
			conf: 'always'
		});

		parseAndRun(
			wrongContent,
			rule
		);

		expect(rule.errors.length).to.be.equal(1);
	});

	describe('Fix absoluteShortcut', () => {
		describe('Fix absoluteShortcut', () => {
			it('Should replace position absolute to absolute', () => {
				const linter = new Linter({
					rules: {
						absoluteShortcut: {
							conf: "always"
						}
					},
					grep: 'absoluteShortcut',
					reporter: 'silent',
					fix: true
				});

				linter.lint('./tests/test.styl', wrongContent);
				linter.display(false);

				const response = linter.reporter.response;

				expect(response.passed).to.be.false;
				expect(response.errors && response.errors.length).to.be.equal(1);

				expect('.tab\n\tabsolute top right 10px left 20px').to.be
					.equal(linter.fix('./tests/test.styl', new Content(wrongContent)));
			});
		});
		describe('Position ans left,right,top,bottom no in next line', () => {
			it('Should not replace Position but show error', () => {
				wrongContent = '.tab\n\tposition absolute\n\tborder 1px solid #ccc\n\ttop 10px\n\tleft 20px\n\tright 10px';

				const linter = new Linter({
					rules: {
						absoluteShortcut: {
							conf: "always"
						}
					},
					grep: 'absoluteShortcut',
					reporter: 'silent',
					fix: true
				});

				linter.lint('./tests/test.styl', wrongContent);
				linter.display(false);

				const response = linter.reporter.response;

				expect(response.passed).to.be.false;
				expect(response.errors && response.errors.length).to.be.equal(1);

				expect(wrongContent).to.be
					.equal(linter.fix('./tests/test.styl', new Content(wrongContent)));
			});
		});
	});
});
