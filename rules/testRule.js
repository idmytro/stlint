import { Rule } from "stlint";

class TestRule extends Rule {
	checkLine(line) {
		if (line.lineno === 1) {
			this.msg('Test error on test line', 1, 1, line.length);
		}
	};
}
