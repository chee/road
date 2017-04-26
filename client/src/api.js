module.exports = {
	getList,
	addPicture,
	getPeers
}

const API_ROOT = 'http://localhost:9990'
const PUBLIC = 'public'

function getList(channel) {
	return fetch(`${API_ROOT}/channels/${channel}`)
		.then(response => response.json())
}

function getPeers() {
	return fetch(`${API_ROOT}/peers`)
		.then(response => response.json())
}

function addPicture(channel = PUBLIC, sha) {
	return fetch(`${API_ROOT}/channels/${channel}`, {
		method: 'POST',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify({sha})
	}).then(response => response.ok ? response.json() : null)
}
