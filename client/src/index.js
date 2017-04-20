const h = require('inferno-hyperscript')
const render = require('inferno').render
const Application = require('./containers/Application')

render(<Application/>, document.getElementById('app'))
