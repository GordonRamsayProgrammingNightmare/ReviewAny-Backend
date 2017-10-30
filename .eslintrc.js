module.exports = {
	"env": {
		"es6": true,
		"node": true
	},
	"extends": "eslint:recommended",

	"rules": {
		"semi": ["error", "always", { "omitLastInOneLineBlock": true}],
		"arrow-spacing": ["error", { "before": true, "after": true }],
		"array-bracket-spacing": ["error", "always", { "singleValue": false }],
		"block-spacing": ["error", "always"],
		"comma-spacing": ["error", { "before": false, "after": true }],
		"object-curly-spacing": ["error", "always"],
		"keyword-spacing": ["error", { "after": true }],
		"space-before-function-paren": ["error", "never"],
		"space-before-blocks": ["error", "always"],
		"no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }],
		"indent": [
			"error",
			"tab",
			{"SwitchCase": 1}
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"single"
		]
	}
};
