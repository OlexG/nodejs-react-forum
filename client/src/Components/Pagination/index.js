import React, { useState } from 'react';
import { Pagination } from 'react-bootstrap';
// helper function for generating a range (1,3,1) -> [1,2,3]
const range = (start, end) =>
	new Array(end - start + 1).fill().map((el, ind) => ind + start);

const PaginationBar = ({ currentPage, setPage, totalPosts, perPage }) => {
	const totalPages = Math.ceil(totalPosts / perPage);
	const [shownPages, setShownPages] = useState(
		range(1, Math.min(totalPages, 3))
	);
	function correctShownPages(value) {
		if (value === 1) {
			setShownPages(range(value, Math.min(totalPages, value + 2)));
		} else if (value === totalPages) {
			setShownPages(range(Math.max(1, value - 2), value));
		} else {
			setShownPages(range(value - 1, value + 1));
		}
	}

	const proccessNewPage = (page) => () => {
		page = Math.max(1, page);
		page = Math.min(totalPages, page);
		correctShownPages(page);
		setPage(page);
	};
	return (
		<Pagination>
			<Pagination.First onClick={proccessNewPage(1)} />
			<Pagination.Prev onClick={proccessNewPage(currentPage - 3)} />
			{shownPages.map((value, index) => {
				return (
					<Pagination.Item
						active={value === currentPage && 'active'}
						key={value}
						onClick={proccessNewPage(value)}
					>
						{value}
					</Pagination.Item>
				);
			})}
			<Pagination.Next onClick={proccessNewPage(currentPage + 3)} />
			<Pagination.Last onClick={proccessNewPage(totalPages)} />
		</Pagination>
	);
};
export default PaginationBar;
