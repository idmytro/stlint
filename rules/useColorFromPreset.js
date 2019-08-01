const path = require('path');
const fs = require('fs');
const  { Content, StylusParser } = require('stlint');
const  { Call, Ident, RGB } = require('stlint').ast;

function useColorFromPreset() {
	this.nodesFilter = ['call'];

	const vars = [];

	const getKeyForColor = (color) => {
		const keys = Object.keys(this.context.colors);

		for (let i = 0; i < keys.length; i += 1) {
			const colors = this.context.colors[keys[i]];
			for (let j = 0; j < colors.length; j += 1) {
				const test = colors[j];

				if (test === color) {
					return `c(${keys[i]}, ${j})`
				}
			}
		}

		return null;
	};

	const visitor = (node) => {
		if (node instanceof Ident && /^\$/.test(node.key)) {
			vars[node.key] = node.value.toString().split(/\s/);
		}

		if (node instanceof Call && node.key === 'registerColors') {
			const colors = JSON.parse(node.nodes[0].toString());

			Object.keys(colors).forEach((key) => {
				this.context.colors[key] = colors[key].replace(/^\(/, '').replace(/\)$/, '').split(/\s/);

				if (this.context.colors[key][0] && /^\$/.test(this.context.colors[key][0])) {
					const value = vars[this.context.colors[key][0]];
					this.context.colors[key] = value;
				}
			});

			return;
		}

		if (node.nodes) {
			node.nodes.forEach(visitor);
		}
	};

	const loadColors = () => {
		const pzlrPath = path.resolve(this.config.basepath, '.pzlrrc');

		if (!fs.existsSync(pzlrPath)) {
			return;
		}

		const pzlr = JSON.parse(fs.readFileSync(pzlrPath, 'utf8'));

		if (!pzlr || !pzlr.dependencies || !Array.isArray(pzlr.dependencies)) {
			return;
		}

		pzlr.dependencies.forEach((pack) => {
			const colorIndex = path.resolve(this.config.basepath, 'node_modules', pack, 'src/global/g-def/colors/index.styl');
			if (!fs.existsSync(colorIndex)) {
				return;
			}

			const str = fs.readFileSync(colorIndex, 'utf8');
			const content = new Content(str);

			const parser = new StylusParser(this.config.stylusParserOptions);
			const ast = parser.parse(content);
			visitor(ast);

		});
	};

	this.checkNode = (node) => {
		if (!this.context.colors) {
			this.context.colors = {};

			try {
				loadColors();
			} catch {

			}
		}

		if (node && node.key.toLowerCase() === 'c') {
			const
				color = node.nodes[0].toString(),
				replace = getKeyForColor(color);

			if (replace) {
				this.msg(`Use instead raw color ${color} mixin ${replace}`,
					node.line.lineno,
					node.column,
					node.column + node.toString().length - 1,
					replace
				);
			}
		}
	};
}

module.exports.useColorFromPreset = useColorFromPreset;
