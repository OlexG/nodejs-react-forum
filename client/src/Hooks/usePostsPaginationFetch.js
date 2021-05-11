import { useState, useEffect } from 'react';
import api from '../api.js';
export default function usePostsPaginationFetch (currentPage, postsPerPage, filterOptions) {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		api.sendPostsPageRequest(currentPage, postsPerPage, filterOptions).then((res) => {
			setPosts(res.data);
		}).catch((error) =>
			console.log(error)
		);
	}, [currentPage, postsPerPage, filterOptions.sort, filterOptions.search]);

	return posts;
}
