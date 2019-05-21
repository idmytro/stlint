const { expect } = require("chai");
const { AllowColorOnlyInC } = require("../../rules/allowColorOnlyInC");

let
	wrongContent = '.tab\n\tcolor #ccc',
	rightContent = '.tab\n\tcolor c(#ccc)';

describe('Test AllowColorOnlyInC', () => {
	beforeEach(() => {
		extendsRule(AllowColorOnlyInC);
	});

	it('Should throw error if use color without c() mixin', () => {
		const rule = new AllowColorOnlyInC({
			conf: 'always'
		});

		parseAndRun(
			wrongContent,
			rule
		);

		expect(rule.errors.length).to.be.equal(1);
		expect(rule.errors[0][2]).to.be.equal(2);
	});
	describe('Color inside C() mixin', () => {
		it('Should not throw error', () => {
			const rule = new AllowColorOnlyInC({
				conf: 'always'
			});

			parseAndRun(
				rightContent,
				rule
			);

			expect(rule.errors.length).to.be.equal(0);
		});
	});
});
