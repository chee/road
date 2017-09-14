const shasum = require('crypto-js/sha256')
const localforage = require('localforage')

localforage.config({
  name: 'the larry sanders show'
})

const storePicture = datauri => {
  const sha = shasum(datauri).toString()
  return localforage.setItem(sha, datauri).then(() => sha)
}

const loadPicture = sha =>
  localforage.getItem(sha)

const checkPicture = (picture, sha) =>
  shasum(picture).toString() === sha

module.exports = {
  storePicture,
  loadPicture,
  checkPicture
}
