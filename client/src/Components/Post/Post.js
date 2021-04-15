import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import styles from './Post.module.css';

const Post = (props) => {
	const dropDownText = React.useRef();

	function swapDropdown () {
		if (dropDownText.current.style.height === '0px' || dropDownText.current.style.height === '') {
			dropDownText.current.classList.add(styles.dropdown_hover);
			dropDownText.current.style.height = `${dropDownText.current.scrollHeight}px`;
		} else {
			dropDownText.current.classList.remove(styles.dropdown_hover);
			dropDownText.current.style.height = '0';
		}
	}

	return (
		<>
			<div className='list-group-item p-0 ml-5' style={{ 'width': '90%' }}>
				<div className='p-3 d-flex flex-row'>
					<p className={styles.post_title}>{props.title}</p>
					<button type='button' className='btn btn-outline-secondary ml-3 pl-3 pr-3 ml-auto' style={{ 'height': '100%' }} onClick={swapDropdown}>Preview</button>
				</div>
				<div ref={dropDownText} className={styles.dropdown}>
					<p>{props.body}</p>
				</div>
			</div>
		</>
	);
};

export default Post;
