import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const Post = (props) => {
	return (
		<div className="post card mb-2" style = {{"width":"70%", "margin":"1em"}}>
			<div class = "card-body">
				<p>{props.text}</p>
			</div>
		</div>
	);
};

export default Post;