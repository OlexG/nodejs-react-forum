import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useSinglePostFetch (id) {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState();

	useEffect(() => {
		api.sendSinglePostRequest(id).then((res) => {
			if (typeof res.data.title === 'string' && typeof res.data.body === 'string') {
				setData(res.data);
				setLoading(false);
			}
		}).catch((error) =>
			console.log(error)
		);
	}, [id]);

	return { loading, data };
}
