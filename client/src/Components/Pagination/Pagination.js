/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Pagination } from 'react-bootstrap';

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
	const totalPages = Math.floor(props.totalPosts / props.perPage);
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
	return (
		<Pagination>
			<Pagination.First onClick = {() => { correctShownPages(1); props.setPage(1); }}/>
			<Pagination.Prev onClick = {() => { correctShownPages(Math.max(1, props.currentPage - 3)); props.setPage(Math.max(1, props.currentPage - 3)); }}/>
			{
				shownPages.map((value, index) => {
					if (value === props.currentPage) {
						return <Pagination.Item active onClick = {() => { correctShownPages(value); props.setPage(value); }}>{value}</Pagination.Item>;
					} else {
						return <Pagination.Item onClick = {() => { correctShownPages(value); props.setPage(value); }}>{value}</Pagination.Item>;
					}
				})
			}
			<Pagination.Next onClick = {() => { correctShownPages(Math.min(totalPages, props.currentPage + 3)); props.setPage(Math.min(totalPages, props.currentPage + 3)); }}/>
			<Pagination.Last onClick = {() => { correctShownPages(totalPages); props.setPage(totalPages); }}/>
		</Pagination>
	);
};
export default PaginationBar;
