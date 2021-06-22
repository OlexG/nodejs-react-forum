import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useReactionsFetch (username, setPopup) {
	const [reactions, setReactions] = useState({});
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function fetchData () {
			if (!username) {
				setLoading(false);
				return;
			}
			try {
				const res = await api.sendReactionsRequest(username);
				if (res.status === 200) {
					setReactions(res.data);
				}
				setLoading(false);
			} catch (e) {
				setPopup('Something went wrong when fetching reactions');
			}
		}
		fetchData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username]);

	return { reactions, loading };
}
