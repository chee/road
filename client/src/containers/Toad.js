const Stream = require('../components/Stream')
const Camera = require('../components/Camera')
const React = require('inferno-compat')
const Component = require('inferno-component')
const {getList, addPicture} = require('../api')
const {loadPicture} = require('../store')

class Toad extends Component {
	constructor(props) {
		super(props)
		this.state = {
			channel: location.pathname.slice(1),
			list: [],
			pictures: [],
			takingPicture: null
		}
		this.loadPicture = this.loadPicture.bind(this)
		this.addPicture = this.addPicture.bind(this)
	}

	addPicture(sha) {
		addPicture(this.state.channel, sha)
			.then(list => list && this.setState({list}))
	}

	loadPicture(sha, index) {
		loadPicture(sha)
			.then(picture =>
				this.setState(state => {
					state.pictures[index] = picture
				}))
	}

	componentDidMount() {
		const {channel} = this.state
		getList(channel).then(list => {
			this.setState({list})
		})
	}

	componentDidUpdate(_, prev) {
		const {list} = this.state
		if (prev.list.length == list.length) return
		list.forEach(this.loadPicture)
	}

	render() {
		const {
			channel,
			pictures
		} = this.state
		return (
			<div>
				<Stream
					pictures={pictures}
				/>
				<Camera
					addPicture={this.addPicture}
					channel={channel}
				/>
			</div>
		)
	}
}

module.exports = Toad
