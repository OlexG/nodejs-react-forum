import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useCommentsFetch (parent, depth = 0) {
	const [comments, setComments] = useState([]);

	useEffect(() => {
		api.sendPostCommentsRequest(parent, depth).then((res) => {
			setComments(res.data);
		}).catch((error) =>
			console.log(error)
		);
	}, [parent, depth]);

	return comments;
}
