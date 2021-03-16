import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const PostCreator = (props) => {
	return (
		<div style = {{"margin-left":"20%", "margin-right":"20%", "margin-top":"2%", "padding":"2em"}} className = "card">
			<form action="/add_post" method="POST">
				<div class="form-group">
					<label>Title</label>
					<input name = "titleInput" class="form-control" id="titleInput" placeholder="Enter title"/>
				</div>
				<div class="form-group">
					<label>Body</label>
					<input name = "bodyInput" class="form-control" id="bodyInput" placeholder="Enter text"/>
				</div>
				<button type="submit" class="btn btn-primary">Submit</button>
			</form>
		</div>
	);
};

export default PostCreator;