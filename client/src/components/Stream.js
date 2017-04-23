const React = require('inferno-compat')

const Stream = ({pictures}) =>
	<ul>
		{
			pictures && pictures.map(picture =>
				<li>
					<figure>
						<img src={picture.url}/>
						<figcaption>{picture.text}</figcaption>
					</figure>
				</li>
			)
		}
	</ul>

module.exports = Stream
