import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import NavbarComponent from '../Navbar';
import api from '../../api.js';
import Popup from '../Popup';

const LoginPage = (props) => {
	const history = useHistory();
	const [popup, setPopup] = useState({});

	async function handleClick(e) {
		e.preventDefault();
		const formElement = e.currentTarget;
		const formData = new FormData(formElement);
		const username = formData.get('username');
		const password = formData.get('password');
		const res = await api.login({
			username,
			password
		});
		if (res.status === 200) {
			history.push('/');
		} else {
			setPopup({ message: 'Incorrect username or password' });
		}
	}
	return (
		<>
			<NavbarComponent />
			{popup.message && <Popup error message={popup.message} />}
			<div
				style={{
					marginLeft: '20%',
					marginRight: '20%',
					marginTop: '2%',
					padding: '2em'
				}}
				className='card'
			>
				<Form id='loginUserForm' onSubmit={handleClick}>
					<Form.Group>
						<Form.Label>Username</Form.Label>
						<Form.Control
							name='username'
							className='form-control'
							id='username'
							placeholder='Enter username'
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type='password'
							name='password'
							className='form-control'
							id='password'
							placeholder='Enter password'
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

export default LoginPage;
