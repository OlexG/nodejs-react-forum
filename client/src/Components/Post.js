import React from 'react';

export default class Post extends React.Component {
	render () {
		return (
			<div className="post">
				<p>{this.props.text}</p>
			</div>
		);
	}
}