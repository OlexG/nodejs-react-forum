import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const Post = (props) => 
	(
		<div className='post card mb-2' style = {{'width':'70%', 'margin':'1em'}}>
			<div className = 'card-body'>
				<p>{props.text}</p>
			</div>
		</div>
	);

export default Post;