import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import NavbarComponent from '../Navbar';
import Popup from '../Popup';
import api from '../../api.js';

const EditPostPage = ({ match }) => {
	const history = useHistory();
	const [popup, setPopup] = useState({});

	async function handleClick(e) {
		e.preventDefault();
		const formElement = e.currentTarget;
		const formData = new FormData(formElement);
		const body = formData.get('body');

		const reqBody = { body };
		const res = await api.sendPostEditRequest(match.params.id, reqBody);
		if (res.status === 200) {
			if (res.data !== 'OK') {
				history.push(`/posts/${match.params.id}`);
			} else {
				history.push('/');
			}
		} else if (res.status === 401) {
			setPopup({ message: 'Invalid credentials. Please login again.' });
		} else {
			setPopup({ message: 'Sorry something went wrong.' });
		}
	}

	return (
		<>
			<NavbarComponent />
			{popup.message && <Popup error message={popup.message} />}
			<div
				style={{
					'margin-left': '20%',
					'margin-right': '20%',
					'margin-top': '2%',
					padding: '2em'
				}}
				className='card'
			>
				<Form onSubmit={handleClick}>
					<div className='form-group'>
						<label>Body</label>
						<Form.Control
							name='body'
							className='form-control'
							id='body'
							placeholder='Enter text'
						/>
					</div>
					<button type='submit' className='btn btn-primary'>
						Submit
					</button>
				</Form>
			</div>
		</>
	);
};

export default EditPostPage;
