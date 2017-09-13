const React = require('inferno-compat')

const Stream = ({pictures}) =>
  <ul>
    {
      pictures && pictures.map(picture =>
        <li>
          <img src={picture} />
        </li>
      )
    }
  </ul>

module.exports = Stream
