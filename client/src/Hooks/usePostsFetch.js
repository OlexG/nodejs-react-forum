import { useState, useEffect } from 'react';
export default function useSinglePostFetch (id) {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		// get post data from server here
		fetch('/api/v1/posts').then(res =>
			res.json()
		).then((res) => {
			setPosts(res);
		});
	}, []);

	return posts;
}
