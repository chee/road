module.exports = {
	getList,
	addPicture
}

const API_ROOT = 'http://localhost:9990'

function getList(channel) {
	return fetch(`${API_ROOT}/${channel}`)
		.then(response => response.json())
}

function addPicture(channel, sha) {
	return fetch(`${API_ROOT}/${channel}`, {
		method: 'POST',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify({sha})
	}).then(response => response.ok ? response.json() : null)
}
