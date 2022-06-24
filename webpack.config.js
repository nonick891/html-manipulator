const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'html-manipulator.js',
		library: {
			name: 'htmlManipulator',
			type: 'umd',
		},
	},
};