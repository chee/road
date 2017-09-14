require('dotenv').config()
const express = require('express')
const app = express()
const body = require('body-parser')
const {PeerServer} = require('peer')
const {readFileSync} = require('fs')

const port = process.env.API_PORT
const peerPort = process.env.PEER_PORT

if (!port || !peerPort) {
  console.error('please add ports to .env')
  process.exit(10)
}

const peers = {}
const peerServer = PeerServer({
  host: process.env.HOST,
  path: '/',
  port: peerPort,
  ssl: {
    cert: readFileSync(process.env.CERT_PATH),
    key: readFileSync(process.env.KEY_PATH)
  }
})

const channels = {
  public: [
    '8947268b7aabcda5844c1a73c273c15630a95ed8fcf5332b5d380ab5bcb53bc6'
  ],
  test: [
    '8947268b7aabcda5844c1a73c273c15630a95ed8fcf5332b5d380ab5bcb53bc6',
    '8947268b7aabcda5844c1a73c273c15630a95ed8fcf5332b5d380ab5bcb53bc6'
  ]
}

app.use((request, response, next) => {
  response.header('access-control-allow-origin', '*')
  response.header(
    'access-control-allow-headers',
    'origin, x-requested-with, content-type, accept'
  )
  next()
})

app.use(body.json())

const get = (request, response) => {
  const {channel} = request.params
  response.statusMessage = 'here you go'
  if (!channels[channel]) {
    channels[channel] = []
  }
  response.send([...channels[channel]].reverse())
}

app.get('/channels/:channel', get)

const noSha = response => {
  response.statusMessage = 'oh dear'
  response.status(400)
  response.send({error: 'no sha'})
}

const sameSha = response => {
  response.statusMessage = 'please no'
  response.status(409)
  response.send({error: 'sorry that\'s the same image as before'})
}

const shaTooLong = response => {
  response.statusMessage = 'awk no'
  response.status(400)
  response.send({error: 'sha too long'})
}

const post = (request, response) => {
  const {params: {channel}, body: {sha}} = request

  if (!channels[channel]) {
    channels[channel] = []
  }

  const list = channels[channel]

  if (!sha) return noSha(response)
  if (sha === list[list.length - 1]) return sameSha(response)
  if (sha.length > 64) return shaTooLong(response)

  response.statusMessage = 'hey thanks'
  response.status(200)
  list.push(sha)
  response.send([...list].reverse())
}

app.post('/channels/:channel', post)

app.get('/peers', (request, response) => {
  response.statusMessage = 'peers here!'
  response.status(200)
  response.send(Object.keys(peers))
})

peerServer.on('connection', id => {
  console.log(id, 'connect')
  peers[id] = id
})

peerServer.on('disconnect', id => {
  console.log(id, 'disconnect')
  delete peers[id]
})

console.log(`listening on prot ${port}`)
app.listen(port)
