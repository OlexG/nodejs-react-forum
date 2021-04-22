import styles from './PostMenu.module.css';
import { Form } from 'react-bootstrap';

const PostMenu = (props) => {
	async function handleClick (e) {
		e.preventDefault();
		const formElement = e.currentTarget;
		const formData = new FormData(formElement);
		const sort = formData.get('select');
		props.setSortingMethod(sort);
	}
	return (
		<Form className={`${styles.menu} ml-5 d-flex flex-row align-items-center`} style={{ 'width': '90%' }} onSubmit={handleClick}>
			<p className={`${styles.menuText}`}>Sort by</p>
			<select className='form-control' name='select' style={{ 'width': '10%' }}>
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
