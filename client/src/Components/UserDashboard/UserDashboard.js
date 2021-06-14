// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import styles from './UserDashboard.module.css';
import useUserDataFetch from '../../Hooks/useUserDataFetch';
import api from '../../api';

const UserDashboard = ({ username }) => {
	const data = useUserDataFetch();
	const hiddenInput = React.useRef();
	function handleChange (e) {
		const formData = new FormData();
		console.log(e.target.files[0]);
		formData.append('image', e.target.files[0]);
		api.sendChangeIconRequest(formData);
	}

	function handleClick () {
		// trigger the click event of the hidden "choose image" input
		hiddenInput.current.click();
	}
	return (
		<>
			<div className='card justify-content-center d-flex flex-column'>
				<div className={styles.background}>
					<p className={styles.editIcon} onClick={handleClick}>Edit Image</p>
					<input ref={hiddenInput} type='file' id='fileField' name='file' accept='image/*' hidden='true' onChange={handleChange}/>
					<div className={`mx-auto ${styles.imgContainer}`}
						style={{ 'background-image': 'url("https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg")' }}
					/>
					<h5 className={styles.text}>{username}</h5>
				</div>
				<ul className='list-group'>
					<li className='list-group-item'>
						<h5 className={styles.text}>Reputation</h5>
						<div className={`p-1 border bg-light ${styles.text}`}>{data.reputation}</div>
					</li>
					<li className='list-group-item'>
						<h5 className={styles.text}>Number of Posts</h5>
						<div className={`p-1 border bg-light ${styles.text}`}>{data.numberOfPosts}</div>
					</li>
				</ul>
			</div>
		</>
	);
};

export default UserDashboard;
