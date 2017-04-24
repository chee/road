module.exports = {
	'env': {
		'node': true,
		'commonjs': true,
		'es6': true
	},
	'extends': [
		'eslint:recommended',
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'no-console': 0,
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		]
	}
}
