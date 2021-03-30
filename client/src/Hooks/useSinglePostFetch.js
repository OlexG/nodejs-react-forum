import { useState, useEffect } from 'react';
export default function useSinglePostFetch (id) {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState();

	useEffect(() => {
		fetch(`/api/v1/posts/${id}`, {}).then((res) =>
			res.json()
		).then((res) => {
			if (typeof res.title === 'string' && typeof res.body === 'string') {
				setData(res);
				setLoading(false);
			}
		}).catch((error) =>
			console.log(error)
		);
	}, [id]);

	return { loading, data };
}
