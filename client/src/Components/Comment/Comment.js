import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const Comment = (props) => {
	return (
		<>
			<div className='p-2 ml-5' style={{ 'width': '90%' }}>
				<div className='list-group-item'>
					<h6>By: {props.author}</h6>
					<p>{props.body}</p>
				</div>
			</div>
		</>
	);
};

export default Comment;
