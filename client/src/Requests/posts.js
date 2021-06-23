import axios from 'axios';
const sendPostNumberRequest = async () => axios.get('/api/v1/posts-number');
const sendPostsPageRequest = async (
	currentPage,
	postsPerPage,
	filterOptions
) => {
	const requestString = '/api/v1/posts?';
	const searchParams = new URLSearchParams(
		`page=${currentPage}&number=${postsPerPage}`
	);
	for (const [key, value] of Object.entries(filterOptions)) {
		searchParams.append(key, value);
	}
	return axios.get(requestString + searchParams.toString());
};
const sendPostCommentsRequest = async (parent, returnWithComments) =>
	axios.get(
		`/api/v1/posts?parent=${parent}&returnWithComments=${returnWithComments}`
	);
const sendPostsRequest = async () => axios.get('/api/v1/posts');
const sendPostSubmitRequest = async (body) => axios.post('/api/v1/posts', body);
const sendSinglePostRequest = async (id) => axios.get(`/api/v1/posts/${id}`);
const sendUpvotePostRequest = async (id) =>
	axios.post(`/api/v1/posts/${id}/upvote`);
const sendDownvotePostRequest = async (id) =>
	axios.post(`/api/v1/posts/${id}/downvote`);
const sendRemovePostReactionsRequest = async (id) =>
	axios.post(`/api/v1/posts/${id}/remove-reactions`);
export {
	sendPostNumberRequest,
	sendPostsPageRequest,
	sendPostCommentsRequest,
	sendPostsRequest,
	sendPostSubmitRequest,
	sendSinglePostRequest,
	sendUpvotePostRequest,
	sendDownvotePostRequest,
	sendRemovePostReactionsRequest
};
