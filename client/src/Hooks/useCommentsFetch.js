import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useCommentsFetch (parent, recursive = true) {
	const [comments, setComments] = useState([]);

	useEffect(() => {
		api.sendPostCommentsRequest(parent, recursive).then((res) => {
			setComments(res.data);
		}).catch((error) =>
			console.log(error)
		);
	}, [parent, recursive]);

	return comments;
}
