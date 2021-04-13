import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';

const Post = (props) => {
	function swapDropdown () {
		console.log(document.getElementById(props.id).style.height);
		if (document.getElementById(props.id).style.height === '0px' || document.getElementById(props.id).style.height === '') {
			const element = document.getElementById(props.id);
			element.classList.add('dropdown-hover');
			element.style.height = element.scrollHeight + 'px';
		} else {
			const element = document.getElementById(props.id);
			element.classList.remove('dropdown-hover');
			element.style.height = '0';
		}
	}

	return (
		<>
			<div className='list-group-item p-0 ml-5' style={{ 'width': '90%' }}>
				<div className='p-3 d-flex flex-row'>
					<p className='post-title'>{props.title}</p>
					<button type='button' className='btn btn-outline-secondary ml-3 pl-3 pr-3 ml-auto' style={{ 'height': '100%' }} onClick={swapDropdown}>Preview</button>
				</div>
				<div id={props.id} className='dropdown'>
					<p>{props.body}</p>
				</div>
			</div>
		</>
	);
};

export default Post;
