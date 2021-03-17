import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const PostCreator = (props) => {
	return (
		<div style = {{'margin-left':'20%', 'margin-right':'20%', 'margin-top':'2%', 'padding':'2em'}} className = 'card'>
			<form action='/posts/add' method='POST'>
				<div className ='form-group'>
					<label>Title</label>
					<input name = 'titleInput' className ='form-control' id='titleInput' placeholder='Enter title'/>
				</div>
				<div className ='form-group'>
					<label>Body</label>
					<input name = 'bodyInput' className ='form-control' id='bodyInput' placeholder='Enter text'/>
				</div>
				<button type='submit' className ='btn btn-primary'>Submit</button>
			</form>
		</div>
	);
};

export default PostCreator;