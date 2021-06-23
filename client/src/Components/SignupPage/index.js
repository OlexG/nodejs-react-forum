import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import NavbarComponent from '../Navbar';
import Popup from '../Popup';
import validatePassword from '../../Validation/validatePassword.js';
import validateUsername from '../../Validation/validateUsername.js';
import api from '../../api.js';

const SignupPage = (props) => {
	const history = useHistory();
	const [formAttributes, setFormAttributes] = useState({
		username: '',
		password: '',
		formError: 'username is too short, password is too short'
	});

	async function handleClick(e) {
		e.preventDefault();
		const formElement = document.querySelector('form');
		const formData = new FormData(formElement);
		const username = formData.get('username');
		const password = formData.get('password');

		const res = await api.signup({
			username,
			password
		});

		if (res.status === 200) {
			// redirect to success page if result is a success
			history.push('/');
		} else if (res.status === 400) {
			const result = res.data;
			setFormAttributes({ formError: result.validation.body.message });
		}
	}
	function handleUserInput(e) {
		const formElement = e.currentTarget;
		const formData = new FormData(formElement);
		const username = formData.get('username');
		const password = formData.get('password');
		const usernameError = validateUsername(username);
		const passwordError = validatePassword(password);
		const formError = [];
		if (usernameError !== 'valid') {
			formError.push(usernameError);
		}
		if (passwordError !== 'valid') {
			formError.push(passwordError);
		}
		if (formError.length === 0) {
			setFormAttributes({ username, password });
		} else {
			setFormAttributes({
				username,
				password,
				formError: formError.join(', ')
			});
		}
	}
	return (
		<>
			<NavbarComponent />
			{formAttributes.formError ? (
				<Popup message={formAttributes.formError} error />
			) : (
				<Popup message='username and password look good!' />
			)}
			<div
				style={{
					marginLeft: '20%',
					marginRight: '20%',
					marginTop: '2%',
					padding: '2em'
				}}
				className='card'
			>
				<Form
					id='addUserForm'
					onSubmit={handleClick}
					onChange={handleUserInput}
				>
					<Form.Group>
						<Form.Label>Username</Form.Label>
						<Form.Control
							name='username'
							className='form-control'
							id='username'
							placeholder='Enter username'
							value={formAttributes.email}
						/>
					</Form.Group>
					<Form.Group className='form-group'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type='password'
							name='password'
							className='form-control'
							id='password'
							placeholder='Enter password'
							value={formAttributes.password}
						/>
					</Form.Group>
					<button type='submit' className='btn btn-primary'>
						Submit
					</button>
				</Form>
			</div>
		</>
	);
};

export default SignupPage;
