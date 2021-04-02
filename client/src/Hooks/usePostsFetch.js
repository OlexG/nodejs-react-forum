import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useSinglePostFetch (id) {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		// get post data from server here
		api.sendPostsRequest().then((res) => {
			setPosts(res.data);
		}).catch((error) =>
			console.log(error)
		);
	}, []);

	return posts;
}
