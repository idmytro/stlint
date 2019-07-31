const { Linter, Content } = require("stlint");
const { expect } = require("chai");
const { ReplaceWidthHeightToSize } = require("../../rules/replaceWidthHeightToSize");

extendsRule(ReplaceWidthHeightToSize);

let wrongContentWithVar = '.tab\n\twidth basis(3)\n\theight basis(2)\n\tpadding-bottom basis(0.75)';

describe('Test replaceWidthHeightToSize', () => {
	it('Should throw error on width and height', () => {
		const rule = new ReplaceWidthHeightToSize({
			conf: 'always'
		});

		parseAndRun(
			wrongContentWithVar,
			rule
		);

		expect(rule.errors.length).to.be.equal(1);
	});

	describe('Fix replaceWidthHeightToSize', () => {
		describe('Fix replaceWidthHeightToSize', () => {
			describe('Fix replaceWidthHeightToSize', () => {
				it('Should replace width and height to size mixin', () => {
					const linter = new Linter({
						rules: {
							replaceWidthHeightToSize: {
								conf: "always"
							}
						},
						grep: 'replaceWidthHeightToSize',
						reporter: 'silent',
						fix: true
					});

					linter.lint('./tests/test.styl', wrongContentWithVar);
					linter.display(false);

					const response = linter.reporter.response;

					expect(response.passed).to.be.false;
					expect(response.errors && response.errors.length).to.be.equal(1);

					expect('.tab\n\tsize basis(3) basis(2)\n\tpadding-bottom basis(0.75)').to.be
						.equal(linter.fix('./tests/test.styl', new Content(wrongContentWithVar)));
				});
			});
			describe('Width and height no in next line', () => {
				it('Should not replace width and height but show error', () => {
					wrongContentWithVar = '.tab\n\twidth basis(3)\n\tcolor #CCC\n\theight basis(2)\n\tpadding-bottom basis(0.75)';

					const linter = new Linter({
						rules: {
							replaceWidthHeightToSize: {
								conf: "always"
							}
						},
						grep: 'replaceWidthHeightToSize',
						reporter: 'silent',
						fix: true
					});

					linter.lint('./tests/test.styl', wrongContentWithVar);
					linter.display(false);

					const response = linter.reporter.response;

					expect(response.passed).to.be.false;
					expect(response.errors && response.errors.length).to.be.equal(1);

					expect(wrongContentWithVar).to.be
						.equal(linter.fix('./tests/test.styl', new Content(wrongContentWithVar)));
				});
			});
		});
	});
});
