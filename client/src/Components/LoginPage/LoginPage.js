import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import NavbarComponent from '../Navbar/Navbar.js';

const LoginPage = (props) => {
	const history = useHistory();

	async function handleClick (e) {
		e.preventDefault();
		const formElement = e.currentTarget;
		const formData = new FormData(formElement);
		const username = formData.get('username');
		const password = formData.get('password');
		const res = await fetch('/token', {
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
			history.push('/');
		} else {
			// display error here
		}
	}
	return (
		<>
			<NavbarComponent/>
			<div style={{ 'marginLeft': '20%', 'marginRight': '20%', 'marginTop': '2%', 'padding': '2em' }} className='card'>
				<Form id='loginUserForm' onSubmit={handleClick}>
					<Form.Group>
						<Form.Label>Username</Form.Label>
						<Form.Control name='username' className='form-control' id='username' placeholder='Enter username'/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control type='password' name='password' className='form-control' id='password' placeholder='Enter password'/>
					</Form.Group>
					<button type='submit' className='btn btn-primary'>Submit</button>
				</Form>
			</div>
		</>
	);
};

export default LoginPage;
