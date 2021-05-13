import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useCommentsFetch (parent, returnWithComments = true) {
	const [comments, setComments] = useState([]);

	useEffect(() => {
		api.sendPostCommentsRequest(parent, returnWithComments).then((res) => {
			setComments(res.data);
		}).catch((error) =>
			console.log(error)
		);
	}, [parent, returnWithComments]);

	return comments;
}
