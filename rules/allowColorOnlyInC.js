const  { RGB } = require('stlint').ast;

function AllowColorOnlyInC() {
	this.nodesFilter = ['rgb'];


	this.checkNode = (node) => {
		const call = node.closest('call');

		if (!call || call.key.toLowerCase() !== 'c') {
			this.msg('Use color only inside c() mixin', node.line, node.column, node.column + node.value.length - 1);
		}
	};
}

module.exports.AllowColorOnlyInC = AllowColorOnlyInC;
