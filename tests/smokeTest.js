const { Linter } = require("stlint");
const { expect } = require("chai");

const
	wrongContent = '.tab\n\tcolor: #ccc'

describe('Smoke test', () => {
	it('Should work', () => {
		const linter = new Linter();
		linter.lint('./tests/test.styl', wrongContent);

		const response = linter.reporter.response;

		expect(response.passed).to.be.false;
		expect(response.errors && response.errors.length).to.be.equal(3);
	});
});
