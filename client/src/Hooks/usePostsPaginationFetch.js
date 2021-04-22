import { useState, useEffect } from 'react';
import api from '../api.js';
export default function usePostsPaginationFetch (currentPage, postsPerPage, sortingMethod) {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		api.sendPostsPageRequest(currentPage, postsPerPage, sortingMethod).then((res) => {
			setPosts(res.data);
		}).catch((error) =>
			console.log(error)
		);
	}, [currentPage, postsPerPage, sortingMethod]);

	return posts;
}
