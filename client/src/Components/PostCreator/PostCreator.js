import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from 'react-router-dom';

const PostCreator = (props) => {
	useEffect(() => {
		document.getElementById('addPostButton').onclick = () => {
			document.getElementById('addPostForm').submit();
		};
	}, []);

	return (
		<div style = {{'margin-left':'20%', 'margin-right':'20%', 'margin-top':'2%', 'padding':'2em'}} className = 'card'>
			<form action='/posts/add' method='POST' id = 'addPostForm'>
				<div className ='form-group'>
					<label>Title</label>
					<input name = 'titleInput' className ='form-control' id='titleInput' placeholder='Enter title'/>
				</div>
				<div className ='form-group'>
					<label>Body</label>
					<input name = 'bodyInput' className ='form-control' id='bodyInput' placeholder='Enter text'/>
				</div>
				<Link to = '/' className ='btn btn-primary' id = 'addPostButton'>Submit</Link>
			</form>
		</div>
	);
};

export default PostCreator;