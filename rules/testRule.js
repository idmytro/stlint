const Rgb = require('stlint').ast.RGB;

function TestRule() {
	nodesFilter = ['rgb']; // can be one of https://github.com/stylus/stlint/tree/master/src/core/ast

	/**
	 * Check the AST node
	 * @param node
	 */
	this.checkNode = (node) => {
		if (node instanceof Rgb) {
			// this.msg('Test error on test node', node.lineno, node.column, node.line.length);
		}
	};

	/**
	 * Check every line
	 * @param line
	 */
	this.checkLine = (line) => {
		if (line.lineno === 1) {
			// this.msg('Test error on test line', line.lineno, 1, line.line.length);
		}
	};
}

module.exports.TestRule = TestRule;
