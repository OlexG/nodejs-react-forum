import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useSinglePostFetch(id, setPopup) {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState();

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await api.sendSinglePostRequest(id);
				if (res.status === 200) {
					setData(res.data);
					setLoading(false);
				} else {
					setPopup({ message: 'Something went wrong when fetching post' });
				}
			} catch (e) {
				setPopup({ message: 'Something went wrong when fetching post' });
			}
		}
		fetchData();
	}, [id, setPopup]);

	return { loading, data };
}
