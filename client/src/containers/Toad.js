const React = require('inferno-compat')
const Component = require('inferno-component')
const Peer = require('peerjs')
const {getList, addPicture, getPeers} = require('../api')
const {loadPicture, checkPicture, storePicture} = require('../store')
const Stream = require('../components/Stream')
const Camera = require('../components/Camera')
const {RESPONSE, REQUEST, RELOAD} = require('../constants')

function request (sha) {
  return {
    type: REQUEST,
    sha
  }
}

function response (sha, picture) {
  return {
    type: RESPONSE,
    sha,
    picture
  }
}

function reload () {
  return {
    type: RELOAD
  }
}

class Toad extends Component {
  constructor (props) {
    super(props)
    this.state = {
      channel: location.pathname.slice(1),
      list: [],
      pictures: [],
      peers: [],
      takingPicture: null
    }
    this.loadPicture = this.loadPicture.bind(this)
    this.addPicture = this.addPicture.bind(this)
  }

  requestPictures (connection) {
    this.state.list.forEach((sha, index) => {
      if (!this.state.pictures[index]) {
        connection.send(request(sha))
      }
    })
  }

  addPicture (sha) {
    addPicture(this.state.channel, sha)
      .then(list => {
        list && this.setState({list})
        this.connections.forEach(connection => {
          connection.send(reload())
        })
      })
  }

  loadPicture (sha, index) {
    loadPicture(sha)
      .then(picture => {
        if (picture) {
          this.setState(state => {
            state.pictures[index] = picture
          })
        } else {
          this.connections.forEach(connection => {
            connection.send(request(sha))
          })
        }
      })
  }

  handleData (connection, data) {
    console.log(data, data.type)
    switch (data.type) {
      case REQUEST: {
        return loadPicture(data.sha)
          .then(picture =>
            picture && connection.send(response(data.sha, picture))
          )
      }
      case RESPONSE: {
        const pictureValid = checkPicture(data.picture, data.sha)

        if (!pictureValid) {
          return console.error('invalid picture received')
        }

        const index = this.state.list.indexOf(data.sha)

        return this.setState(state => {
          state.pictures[index] = data.picture
          storePicture(data.picture)
        })
      }
      case RELOAD: {
        return getPeers()
          .then(peers =>
            this.setState({peers})
          )
      }
      default:
    }
  }

  componentDidMount () {
    const {channel} = this.state
    this.peer = new Peer({
      host: '/',
      secure: true,
      port: window._env.PEER_PORT
    })

    this.connections = []

    this.peer.on('connection', connection => {
      connection.on('open', () => {
        this.connections.push(connection)
        this.requestPictures(connection)
        connection.on('data', this.handleData.bind(this, connection))
      })
    })

    getList(channel).then(list =>
      this.setState({list}))
    getPeers().then(peers =>
      this.setState({peers}))
  }

  componentDidUpdate (prevProps, prevState) {
    const {list, peers} = this.state
    if (prevState.peers !== peers) {
      peers.forEach(peer => {
        const connection = this.peer.connect(peer)
        connection.on('open', () => {
          this.connections.push(connection)
          this.requestPictures(connection)
          connection.on('data', this.handleData.bind(this, connection))
        })
      })
    }
    if (prevState.list !== list) {
      list.forEach(this.loadPicture)
    }
  }

  render () {
    const {
      channel,
      pictures
    } = this.state

    return (
      <div>
        <Camera
          addPicture={this.addPicture}
          channel={channel}
        />
        <Stream
          pictures={pictures}
        />
      </div>
    )
  }
}

module.exports = Toad
