import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useReactionsFetch () {
	const [reactions, setReactions] = useState({});

	useEffect(() => {
		// get post data from server here
		api.sendReactionsRequest().then((res) => {
			setReactions(res.data);
		}).catch((error) =>
			console.log(error)
		);
	}, []);

	return reactions;
}
