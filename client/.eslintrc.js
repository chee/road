module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  plugins: ['inferno'],
  extends: [
    'eslint:recommended',
    'plugin:inferno/recommended',
    'standard',
    'standard-react'
  ],
  parser: 'babel-eslint',
  rules: {
    'no-console': ['off'],
    'react/prop-types': ['off']
  }
}
