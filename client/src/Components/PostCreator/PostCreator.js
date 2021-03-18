import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import NavbarComponent from '../Navbar/Navbar.js';

const PostCreator = (props) => {
	let history = useHistory();

	async function handleClick(e) {
		e.preventDefault();
		let formElement = document.querySelector('form');
		var formData = new FormData(formElement);
		let title = formData.get('title');
		let body = formData.get('body');
		let res = await fetch('/posts', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body:JSON.stringify({
				title,
				body
			})
		});
		if (res.status === 200){
			let result = await res.json();
			history.push(`/posts/${result}`);
		}
	}
	return (
		<>
			<NavbarComponent/>
			<div style = {{'margin-left':'20%', 'margin-right':'20%', 'margin-top':'2%', 'padding':'2em'}} className = 'card'>
				<Form id = 'addPostForm' onSubmit = {handleClick}>
					<div className ='form-group'>
						<label>Title</label>
						<Form.Control name = 'title' className ='form-control' id='title' placeholder='Enter title'/>
					</div>
					<div className ='form-group'>
						<label>Body</label>
						<Form.Control name = 'body' className ='form-control' id='body' placeholder='Enter text'/>
					</div>
					<button type = 'submit' className ='btn btn-primary'>Submit</button>
				</Form>
			</div>
		</>
	);
};

export default PostCreator;