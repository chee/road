const React = require('inferno-compat')
const {storePicture} = require('../store')

class Camera extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			takingPicture: false
		}
		const fns = [
			'takePicture'
		]
		fns.forEach(fn => this[fn] = this[fn].bind(this))
	}

	takePicture() {
		let videoStream
		this.setState({
			takingPicture: true
		})
		navigator
			.mediaDevices
			.getUserMedia({video: true, audio: false})
			.then(stream => {
				this.video.srcObject = stream
				this.video.play()
				this.video.width = 500
				videoStream = stream
			})
			// eslint-disable-next-line
			.catch(error => console.error('oh no:', error))
		this.video.addEventListener('canplay', () => {
			const context = this.canvas.getContext('2d')
			context.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight)
			storePicture(this.canvas.toDataURL('image/jpg'))
				.then(this.props.addPicture)
			// eslint-disable-next-line
				.catch(error => console.error('error adding picture', error))
			this.setState({
				takingPicture: false
			})
			videoStream.getTracks()[0].stop()
		})
	}

	render() {
		const {
			takingPicture
		} = this.state
		return (
			<div>
				{ takingPicture &&
					<div>
						<video ref={node => this.video = node}/>
						<canvas ref={node => this.canvas = node}/>
					</div>
				}
				<button onClick={this.takePicture}>
					📷
				</button>
			</div>
		)
	}
}

module.exports = Camera
