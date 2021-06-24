import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const Popup = (props) => {
	return (
		<div
			className={`alert alert-${props.error ? 'danger' : 'success'}`}
			role='alert'
		>
			{props.message}
		</div>
	);
};

export default Popup;
