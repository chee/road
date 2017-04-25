const express = require('express')
const app = express()
const body = require('body-parser')
const PUBLIC = 'public'

const port = process.env.PORT || 9990

const channels = {
	[PUBLIC]: [
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
	response.send(channels[channel || PUBLIC])
}

app.get('/', get)
app.get('/:channel', get)

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

	const list = channels[channel || PUBLIC]

	if (!sha) return noSha(response)
	if (sha == list[list.length - 1]) return sameSha(response)
	if (sha.length > 64) return shaTooLong(response)

	response.statusMessage = 'hey thanks'
	response.status(200)
	list.push(sha)
	response.send([...list].reverse())
}

app.post('/', post)
app.post('/:channel', post)

console.log(`listening on prot ${port}`)
app.listen(port)
