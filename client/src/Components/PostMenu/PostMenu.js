import React from 'react';
import styles from './PostMenu.module.css';
import { Form } from 'react-bootstrap';

const PostMenu = (props) => {
	const formElement = React.useRef();

	async function changeSortOption (e) {
		const formData = new FormData(formElement.current);
		const sort = formData.get('select');
		props.setSortingMethod(sort);
	}
	return (
		<Form ref={formElement} className={`${styles.menu} ml-5 d-flex flex-row align-items-center`} style={{ 'width': '90%' }}>
			<p className={`${styles.menuText}`}>Sort by</p>
			<select className='form-control' name='select' style={{ 'width': '10%' }} onChange={changeSortOption}>
				<option>default</option>
				<option>most-upvotes</option>
				<option>recent</option>
				<option>oldest</option>
			</select>
			<button type='submit' className={`${styles.menuButton} btn btn-outline-secondary ml-3 pl-5 pr-5 btn-light ml-auto`}>Filter</button>
		</Form>
	);
};

export default PostMenu;
