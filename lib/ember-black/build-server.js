const babel = require("./babel");

module.exports = function(tree) {
	return new babel([tree], {
		plugins: [
			'transform-async-to-generator',
			'transform-es2015-modules-commonjs',
			'transform-function-bind',
			'transform-es2015-destructuring',
		],
		sourceMaps: 'inline',
		babelrc: false,
	});
}