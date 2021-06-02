import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useReactionsFetch () {
	const [reactions, setReactions] = useState({});
	const [error, setError] = useState();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		api.sendReactionsRequest().then((res) => {
			setReactions(res.data);
			setLoading(false);
		}).catch((error) => {
			setError(error);
		});
	}, []);

	if (error) {
		return error;
	}
	return { reactions, loading };
}
