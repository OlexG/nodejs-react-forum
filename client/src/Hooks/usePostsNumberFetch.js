import { useState, useEffect } from 'react';
import api from '../api.js';
export default function usePostsNumberFetch(setPopup) {
	const [totalPosts, setTotalPosts] = useState(0);

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await api.sendPostNumberRequest();
				if (res.status === 200) {
					setTotalPosts(res.data);
				} else {
					setPopup({
						message: 'Something went wrong when getting the number of posts.'
					});
				}
			} catch (e) {
				console.log(e);
				setPopup({
					message: 'Something went wrong when getting the number of posts.'
				});
			}
		}
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return totalPosts;
}
