const API_ROOT = `${location.origin}/_api/`
const PUBLIC = 'public'

const getList = channel =>
  fetch(`${API_ROOT}/channels/${channel || PUBLIC}`)
    .then(response => response.json())

const getPeers = () =>
  fetch(`${API_ROOT}/peers`)
    .then(response => response.json())

const addPicture = (channel, sha) =>
  fetch(`${API_ROOT}/channels/${channel || PUBLIC}`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({sha})
  }).then(response =>
    response.ok
      ? response.json()
      : Promise.reject(response)
    )

module.exports = {
  getList,
  addPicture,
  getPeers
}
