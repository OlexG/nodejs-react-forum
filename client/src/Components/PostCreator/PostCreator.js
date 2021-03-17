import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router';

const PostCreator = (props) => {
	let history = useHistory();

	function handleClick(e) {
		e.preventDefault();
		let formElement = document.querySelector('form');
		var formData = new FormData(formElement);
		let title = formData.get('titleInput');
		let body = formData.get('bodyInput');
		fetch('/posts/add', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body:JSON.stringify({
				title,
				body
			})
		});
		history.push('/');
	}
	return (
		<div style = {{'margin-left':'20%', 'margin-right':'20%', 'margin-top':'2%', 'padding':'2em'}} className = 'card'>
			<Form action='/posts/add' method='POST' id = 'addPostForm' onSubmit = {handleClick}>
				<div className ='form-group'>
					<label>Title</label>
					<Form.Control name = 'titleInput' className ='form-control' id='titleInput' placeholder='Enter title'/>
				</div>
				<div className ='form-group'>
					<label>Body</label>
					<Form.Control name = 'bodyInput' className ='form-control' id='bodyInput' placeholder='Enter text'/>
				</div>
				<button type = 'submit' className ='btn btn-primary'>Submit</button>
			</Form>
		</div>
	);
};

export default PostCreator;