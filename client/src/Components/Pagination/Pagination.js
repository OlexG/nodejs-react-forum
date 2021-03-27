import React, { useState } from 'react';
import { Pagination } from 'react-bootstrap';

// helper function for generating a range (1,3,1) -> [1,2,3]
const range = (from, to, step = 1) => {
	let i = from;
	const range = [];
	while (i <= to) {
		range.push(i);
		i += step;
	}
	return range;
};

const PaginationBar = (props) => {
	const totalPages = Math.ceil(props.totalPosts / props.perPage);
	// <<PaginationBar currentPage = {currentPage} setPage = {setCurrentPage} totalPosts = {totalPosts} perPage = {10}/>
	const [shownPages, setShownPages] = useState(range(1, Math.min(totalPages, 3)));
	function correctShownPages (value) {
		console.log(props.totalPosts);
		if (value === 1) {
			setShownPages(range(value, Math.min(totalPages, value + 2)));
		} else if (value === totalPages) {
			setShownPages(range(Math.max(1, value - 2), value));
		} else {
			setShownPages(range(value - 1, value + 1));
		}
		console.log(shownPages);
	}

	function proccessNewPage (page) {
		page = Math.max(1, page);
		page = Math.min(totalPages, page);
		correctShownPages(page);
		props.setPage(page);
	}
	return (
		<Pagination>
			<Pagination.First onClick={() => { proccessNewPage(1); }}/>
			<Pagination.Prev onClick={() => { proccessNewPage(props.currentPage - 3); }}/>
			{
				shownPages.map((value, index) => {
					return <Pagination.Item active={value === props.currentPage && 'active'} key={value} onClick={() => { proccessNewPage(value); }}>{value}</Pagination.Item>;
				})
			}
			<Pagination.Next onClick={() => { proccessNewPage(props.currentPage + 3); }}/>
			<Pagination.Last onClick={() => { proccessNewPage(totalPages); }}/>
		</Pagination>
	);
};
export default PaginationBar;
