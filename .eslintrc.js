module.exports = {
  "root": true,
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
  "rules": {
    "curly": [2, "multi-line"],
    "eqeqeq": 2,
    "indent": ["error", 2],
    "no-console": "off",
    "no-empty": 2,
    "no-eval": 2,
    "no-extend-native": 2,
    "no-extra-parens": [2, "all"],
    "no-extra-semi": 2,
    "no-irregular-whitespace": 2,
    "no-multi-spaces": 2,
    "no-multi-str": 2,
    "no-multiple-empty-lines": [2, { "max": 1 }],
    "no-unexpected-multiline": 2,
    "no-unreachable": 2,
    "no-var": 2,
    "prefer-const": 2,
    // "quotes": [2, "single"],
    "semi": [2, "never"]
  }
}