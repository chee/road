module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es6': true
	},
	'plugins': ['inferno', 'react'],
	'extends': [
		'eslint:recommended',
		'plugin:inferno/recommended'
	],
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		}
	},
	'rules': {
		'react/jsx-uses-react': 'error',
		'react/jsx-uses-vars': 'error',
		'indent': [
			'error',
			'tab'
		],
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
