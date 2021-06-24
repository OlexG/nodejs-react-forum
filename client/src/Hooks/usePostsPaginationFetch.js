import { useState, useEffect } from 'react';
import api from '../api.js';
export default function usePostsPaginationFetch(
	currentPage,
	postsPerPage,
	filterOptions,
	setPopup
) {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await api.sendPostsPageRequest(
					currentPage,
					postsPerPage,
					filterOptions
				);
				if (res.status === 200) {
					setPosts(res.data);
				} else {
					setPopup({
						message: 'Something went wrong when fetching the posts.'
					});
				}
			} catch (e) {
				setPopup({ message: 'Something went wrong when fetching the posts.' });
			}
		}
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, postsPerPage, filterOptions.sort, filterOptions.search]);

	return posts;
}
