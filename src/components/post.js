import React from 'react';

class Post extends React.Component {
	render () {
		return (
			<div className="post">
				<p>{this.props.text}</p>
			</div>
		);
	}
}

export default Post;
