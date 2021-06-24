import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useReactionsFetch(username, setPopup) {
	const [reactions, setReactions] = useState({});
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function fetchData() {
			if (!username) {
				setLoading(false);
				return;
			}
			try {
				const res = await api.sendReactionsRequest(username);
				if (res.status === 200) {
					setReactions(res.data);
				} else {
					setPopup({ message: 'Something went wrong when fetching reactions' });
				}
			} catch (e) {
				setPopup({ message: 'Something went wrong when fetching reactions' });
			}
			setLoading(false);
		}
		fetchData();
	}, [username, setPopup]);

	return { reactions, loading };
}
