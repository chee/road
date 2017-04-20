module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true
	},
	"plugins": ["inferno"],
	"extends": ["eslint:recommended", "plugin:inferno/recommended"],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		}
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"never"
		],
		"no-unused-vars": [
			"error",
			{varsIgnorePattern: "^h$"}
		]
	}
};
