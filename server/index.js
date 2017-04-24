const express = require('express')
const app = express()
const body = require('body-parser')

const port = process.env.PORT || 9990

const channels = {
	test: [{
		msg: 'hello, world!',
		sha: '8947268b7aabcda5844c1a73c273c15630a95ed8fcf5332b5d380ab5bcb53bc6'
	}]
}

const status404 = (_, response) => response.status(404).send('pls specify a channel')

app.use(body.json())
app.get('/', status404)
app.post('/', status404)

app.get('/:channel', (request, response) => {
	const {channel} = request.params
	response.statusMessage = 'here you go'
	response.send(channels[channel])
})

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

const msgTooLong = response => {
	response.statusMessage = 'excuse me please'
	response.status(400)
	response.send({error: 'msg too long'})
}

app.post('/:channel', (request, response) => {
	const {channel} = request.params

	const picture = {
		msg: request.body.msg,
		sha: request.body.sha
	}

	const chan = channels[channel] = channels[channel] || []

	if (!picture.sha) return noSha(response)
	if (picture.sha == chan[chan.length - 1].sha) return sameSha(response)
	if (picture.sha.length > 64) return shaTooLong(response)
	if (picture.msg.length > 255) return msgTooLong(response)

	response.statusMessage = 'hey thanks'
	response.status(200)
	chan.push(picture)
	response.send(chan)
})

console.log(`listening on prot ${port}`)
app.listen(port)
