const { Linter, Content } = require("stlint");
const { expect } = require("chai");
const { AbsoluteShortcut } = require("../../rules/absoluteShortcut");

extendsRule(AbsoluteShortcut);

describe('Test absolute or fixed Shortcut rule', () => {
	['absolute', 'fixed'].forEach((cssRuleName) => {
		let
			wrongContent = '.tab\n\tposition ' + cssRuleName + '\n\ttop 10px\n\tleft 20px\n\tright 10px',
			rightContent = '.tab\n\tposition ' + cssRuleName + '\n\tcolor red';

		describe('Test ' + cssRuleName + 'Shortcut', () => {

			it('Should throw error position ' + cssRuleName, () => {
				const rule = new AbsoluteShortcut({
					conf: 'always'
				});

				parseAndRun(
					wrongContent,
					rule
				);

				expect(rule.errors.length).to.be.equal(1);
			});

			describe('Fix Shortcut', () => {
				describe('Fix ' + cssRuleName + 'Shortcut', () => {
					it('Should replace position ' + cssRuleName + ' to ' + cssRuleName, () => {
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

						expect('.tab\n\t' + cssRuleName + ' top right 10px left 20px').to.be
							.equal(linter.fix('./tests/test.styl', new Content(wrongContent)));
					});

					describe('There are not (left|right|top|bottom) properties after position ' + cssRuleName, () => {
						it('Should not replace position ' + cssRuleName + ' to ' + cssRuleName, () => {
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

							linter.lint('./tests/test.styl', rightContent);
							linter.display(false);

							const response = linter.reporter.response;

							expect(response.passed).to.be.true;
						});
					});
				});

				describe('Position and left,right,top,bottom no in next line', () => {
					it('Should not replace Position but show error', () => {
						wrongContent = '.tab\n\tposition ' + cssRuleName + '\n\tborder 1px solid #ccc\n\ttop 10px\n\tleft 20px\n\tright 10px';

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
	});
});
