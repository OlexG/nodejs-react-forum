import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useCommentsFetch(
	parent,
	setPopup,
	returnWithComments = true
) {
	const [comments, setComments] = useState([]);

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await api.sendPostCommentsRequest(
					parent,
					returnWithComments
				);
				if (res.status === 200) {
					setComments(res.data);
				} else {
					setPopup({
						message: 'Something went wrong when fetching the comments'
					});
				}
			} catch (e) {
				setPopup({
					message: 'Something went wrong when fetching the comments'
				});
				console.log(e);
			}
		}
		fetchData();
	}, [parent, returnWithComments, setPopup]);

	return comments;
}
