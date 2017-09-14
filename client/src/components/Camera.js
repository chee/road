const React = require('inferno-compat')
const {storePicture} = require('../store')

class Camera extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      takingPicture: false
    }

    const functions = [
      'setTakingPicture',
      'clearTakingPicture',
      'takePicture'
    ]

    functions.forEach(fn => {
      this[fn] = this[fn].bind(this)
    })
  }

  setTakingPicture () {
    this.setState({takingPicture: true})
  }

  clearTakingPicture () {
    this.setState({takingPicture: false})
  }

  takePicture () {
    let videoStream

    this.setTakingPicture()

    navigator
      .mediaDevices
      .getUserMedia({video: true, audio: false})
      .then(stream => {
        this.video.srcObject = stream
        this.video.play()
        videoStream = stream
      })
      .catch(error => console.error('oh no:', error))

    this.video.addEventListener('canplay', () => {
      setTimeout(() => {
        const context = this.canvas.getContext('2d')
        const style = getComputedStyle(this.video)
        const width = parseInt(style.width)
        const height = parseInt(style.height)
        this.canvas.setAttribute('width', width)
        this.canvas.setAttribute('height', height)
        context.drawImage(
          this.video,
          0, 0,
          width, height
        )
        storePicture(this.canvas.toDataURL('image/jpeg', true))
          .then(picture => {
            console.log(picture)
            this.props.addPicture(picture)
            this.clearTakingPicture()
            videoStream.getTracks()[0].stop()
          })
          .catch(error => console.error('error adding picture', error))
      }, 1000)
    })
  }

  render () {
    const {
      takingPicture
    } = this.state

    return (
      <div>
        {takingPicture &&
          <div>
            <video
              ref={node => {
                this.video = node
              }}
            />
            <canvas
              ref={node => {
                this.canvas = node
              }}
            />
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
