import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useCommentsFetch (parent) {
	const [comments, setComments] = useState([]);

	useEffect(() => {
		api.sendPostCommentsRequest(parent).then((res) => {
			setComments(res.data);
		}).catch((error) =>
			console.log(error)
		);
	}, [parent]);

	return comments;
}
