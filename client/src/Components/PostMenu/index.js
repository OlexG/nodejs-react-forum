import React, { useState } from 'react';
import styles from './PostMenu.module.css';
import { Form } from 'react-bootstrap';

const PostMenu = (props) => {
	const formElement = React.useRef();
	const [searchText, setSearchText] = useState('');

	function changeSortOption(e) {
		const formData = new FormData(formElement.current);
		const sort = formData.get('select');
		props.setFilterOptions({ ...props.filterOptions, sort: sort });
	}

	function handleSearchChange(e) {
		setSearchText(e.target.value);
	}

	function setFilterOptions(e) {
		if (searchText !== '') {
			props.setFilterOptions({ ...props.filterOptions, search: searchText });
		} else {
			props.setFilterOptions((filterOptions) => {
				const newFilterOptions = { ...filterOptions };
				delete newFilterOptions.search;
				return newFilterOptions;
			});
		}
	}

	return (
		<Form
			ref={formElement}
			className={`${styles.menu} ml-5 d-flex flex-row align-items-center`}
			style={{ width: '90%' }}
		>
			<p className={`${styles.menuText}`}>Sort by</p>
			<select
				className='form-control'
				name='select'
				style={{ width: '10%' }}
				onChange={changeSortOption}
			>
				<option>default</option>
				<option>most-upvotes</option>
				<option>recent</option>
				<option>oldest</option>
			</select>
			<input
				type='text'
				className='ml-5'
				value={searchText}
				onChange={handleSearchChange}
			/>
			<button
				type='button'
				onClick={setFilterOptions}
				className={`${styles.menuButton} btn btn-outline-secondary ml-3 pl-5 pr-5 btn-light ml-auto`}
			>
				Filter
			</button>
		</Form>
	);
};

export default PostMenu;
