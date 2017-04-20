const Component = require('inferno-component')
const Hello = require('../components/Hello')
const h = require('inferno-hyperscript')

class Application extends Component {
	render() {
		return (
			<Hello/>
		)
	}
}

module.exports = Application
