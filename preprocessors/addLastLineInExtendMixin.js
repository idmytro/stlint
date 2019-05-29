/**
 * Append empty comment after extends directive if it empty
 * In v4fire `i-data extends i-message` is valid construction
 * but for stylus it is selector and after this should be some indent with some text
 * @param content
 */
const
	extendReg = /(\t\s)*([_\-\w]+[\s]+extends[\s]+[_\-\w]+)/g;

module.exports = function (content) {
	let res;
	do {
		res = extendReg.exec(content);

		if (res && !content.substr(res.index + res[0].length).trim().length) {
			content = content + '\n' + (res[1] || '') + '\t// empty comment'
		}

	} while(res);

	return content;
};
