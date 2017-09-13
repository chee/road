const React = require('inferno-compat')
const render = require('inferno').render
const Toad = require('./containers/Toad')

render(<Toad />, document.getElementById('app'))
