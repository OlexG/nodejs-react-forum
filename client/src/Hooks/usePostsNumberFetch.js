import { useState, useEffect } from 'react';
import api from '../api.js';
export default function usePostsNumberFetch (id) {
	const [totalPosts, setTotalPosts] = useState(0);

	useEffect(() => {
		// get post data from server here
		api.sendPostNumberRequest().then((res) => {
			setTotalPosts(res.data);
		}).catch((error) =>
			console.log(error)
		);
	}, []);

	return totalPosts;
}
