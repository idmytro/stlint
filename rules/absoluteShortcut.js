const  { Property, Value } = require('stlint').ast;

const AbsoluteKeys = [
	'top',
	'right',
	'bottom',
	'left'
];

function AbsoluteShortcut() {
	this.nodesFilter = ['block'];

	/**
	 * Check the AST node
	 * @param node
	 */
	this.checkNode = (node) => {
		const orderKeys = this.conf.orderKeys || AbsoluteKeys;

		let
			hasAbsolute = false,
			sizes = [];

		node.nodes.forEach((child) => {
			if (child instanceof Property || child instanceof Value) {
				if (orderKeys.includes(child.key)) {
					sizes.push(child);
				} else if (child.key === 'position' && child.value.toString() === 'absolute') {
					hasAbsolute = child;
					sizes.push(child);
				}
			}
		});

		if (hasAbsolute) {
			sizes.sort((a, b) => a.lineno - b.lineno);

			let canFix = true;

			for (let i = 1; i < sizes.length; i+= 1) {
				if (sizes[i].lineno - sizes[i - 1].lineno !== 1) {
					canFix = false;
					break;
				}
			}

			let fix = null;

			if (canFix) {
				const
					ordered = [...sizes];

				ordered.sort((a, b) => orderKeys.indexOf(a.key) - orderKeys.indexOf(b.key));

				let previous = null;

				const
					pos = ordered.reduce((res, prop) => {
						if (prop.key !== 'position') {
							if (previous && previous.value.toString() !== prop.value.toString()) {
								res.push(previous.value);
							}

							res.push(prop.key);

							previous = prop;
						}
						return res;
					}, ['absolute']);

				if (previous) {
					pos.push(previous.value);
				}

				fix = pos.join(' ');
			}

			this.msg(
				'Replace position:absolute to absolute',
				sizes[0].lineno,
				sizes[0].column,
				sizes[sizes.length - 1].line.line.length,
				fix,
				sizes[sizes.length - 1].lineno
			);
		}
	};
}

module.exports.AbsoluteShortcut = AbsoluteShortcut;
