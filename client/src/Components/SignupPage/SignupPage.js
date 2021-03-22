import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import NavbarComponent from '../Navbar/Navbar.js';

const SignupPage = (props) => {
	const history = useHistory();

	async function handleClick (e) {
		e.preventDefault();
		const formElement = document.querySelector('form');
		const formData = new FormData(formElement);
		const username = formData.get('username');
		const password = formData.get('password');

		const res = await fetch('/users', {
			'headers': {
				'Content-Type': 'application/json'
			},
			'method': 'POST',
			'body': JSON.stringify({
				username,
				password
			})
		});
		if (res.status === 200) {
			// redirect to user page
			history.push('/');
		} else if (res.status === 400) {
			const result = await res.json();
			console.log(result);
		}
	}
	return (
		<>
			<NavbarComponent/>
			<div style = {{ 'margin-left': '20%', 'margin-right': '20%', 'margin-top': '2%', 'padding': '2em' }} className = 'card'>
				<Form id = 'addPostForm' onSubmit = {handleClick}>
					<div className = 'form-group'>
						<label>Username</label>
						<Form.Control name = 'username' className ='form-control' id='username' placeholder='Enter username'/>
					</div>
					<div className ='form-group'>
						<label>Password</label>
						<Form.Control name = 'password' className ='form-control' id='password' placeholder='Enter password'/>
					</div>
					<button type = 'submit' className ='btn btn-primary'>Submit</button>
				</Form>
			</div>
		</>
	);
};

export default SignupPage;
