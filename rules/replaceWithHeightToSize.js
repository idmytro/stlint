const  { Property, Value } = require('stlint').ast;

function ReplaceWithHeightToSize() {
	this.nodesFilter = ['block'];

	/**
	 * Check the AST node
	 * @param node
	 */
	this.checkNode = (node) => {
		let
			width = false,
			height = false;

		node.nodes.forEach((child) => {
			if (child instanceof Property || child instanceof Value) {
				if (child.key === 'width') {
					width = child;
				}
				if (child.key === 'height') {
					height = child;
				}
			}
		});

		if (width && height) {
			const
				fix = Math.abs(width.lineno - height.lineno) === 1 ?
					'size ' + width.value + (width.value.toString() === height.value.toString() ? '' : ' ' + height.value) : null;

			this.msg('Need replace width and height to size',
				width.lineno,
				width.column,
				height.line.line.length,
				fix,
				height.lineno);
		}
	};
}

module.exports.ReplaceWithHeightToSize = ReplaceWithHeightToSize;
