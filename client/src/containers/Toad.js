const React = require('inferno-compat')
const Component = require('inferno-component')
const Peer = require('peerjs')
const {getList, addPicture, getPeers} = require('../api')
const {loadPicture, checkPicture, storePicture} = require('../store')
const Stream = require('../components/Stream')
const Camera = require('../components/Camera')

function request (sha) {
  return {
    request: true,
    sha
  }
}

function response (sha, picture) {
  return {
    response: true,
    sha,
    picture
  }
}

function reload () {
  return {
    reload: true
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
    if (data.request) {
      loadPicture(data.sha).then(picture => {
        picture && connection.send(response(data.sha, picture))
      })
    } else if (data.response) {
      const pictureValid = checkPicture(data.picture, data.sha)
      if (!pictureValid) {
        return console.error('invalid picture received')
      }
      const index = this.state.list.indexOf(data.sha)
      this.setState(state => {
        state.pictures[index] = data.picture
        storePicture(data.picture)
      })
    } else if (data.reload) {
      getPeers().then(peers =>
        this.setState({peers}))
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
