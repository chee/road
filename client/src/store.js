module.exports = {
	storePicture,
	loadPicture
}

const shasum = require('crypto-js/sha256')
const localforage = require('localforage')

localforage.config({
	name: 'the larry sanders show'
})

function storePicture(datauri) {
	const sha = shasum(datauri).toString()
	return localforage.setItem(sha, datauri).then(() => sha)
}

function loadPicture(sha) {
	return localforage.getItem(sha)
}