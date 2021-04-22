import { useState, useEffect } from 'react';
import api from '../api.js';
export default function usePostsPaginationFetch (currentPage, postsPerPage) {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		api.sendPostsPageRequest(currentPage, postsPerPage).then((res) => {
			setPosts(res.data);
		}).catch((error) =>
			console.log(error)
		);
	}, [currentPage, postsPerPage]);

	return posts;
}
