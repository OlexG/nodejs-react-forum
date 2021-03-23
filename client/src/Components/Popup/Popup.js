import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const Popup = (props) => {
	return (
		<>
			{
				props.error ?
					(
						<div className='alert alert-danger' role='alert'>{props.message}</div>
					) :
					(
						<div className='alert alert-success' role='alert'>{props.message}</div>
					)
			}
		</>
	);
};

export default Popup;
