const { Linter } = require("stlint");
const { expect } = require("chai");
const path = require("path");

const
	wrongContent = '$p = {}\ni-block extends i-data'

describe('Preprocessor test', () => {
	it('Should be loaded and should be applied before lint', () => {
		console.log(path.join(__dirname + '/../preprocessors/addLastLineInExtendMixin.js'));

		const linter = new Linter({
			preprocessors: [path.join(__dirname + '/../preprocessors/addLastLineInExtendMixin.js')]
		});

		linter.lint('./tests/test.styl', wrongContent);

		const response = linter.reporter.response;

		expect(response.passed).to.be.true;
	});
});
