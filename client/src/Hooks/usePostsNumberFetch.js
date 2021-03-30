import { useState, useEffect } from 'react';
export default function usePostsNumberFetch (id) {
	const [totalPosts, setTotalPosts] = useState(0);

	useEffect(() => {
		// get post data from server here
		fetch('/api/v1/posts-number').then(res =>
			res.json()
		).then((res) => {
			setTotalPosts(res);
		});
	}, []);

	return totalPosts;
}
