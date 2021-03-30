import { useState, useEffect } from 'react';
export default function usePostsPaginationFetch (currentPage, postsPerPage) {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		// get post data from server here
		fetch(`/api/v1/posts/${currentPage}/${postsPerPage}`).then(res =>
			res.json()
		).then((res) => {
			setPosts(res);
		});
	}, [currentPage, postsPerPage]);

	return posts;
}
