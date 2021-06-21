import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useReactionsFetch (username) {
	const [reactions, setReactions] = useState({});
	const [error, setError] = useState();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		api.sendReactionsRequest(username).then((res) => {
			setReactions(res.data);
			setLoading(false);
		}).catch((error) => {
			setError(error);
		});
	}, [username]);

	if (error) {
		return error;
	}
	return { reactions, loading };
}
