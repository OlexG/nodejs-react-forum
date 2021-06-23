/* eslint-disable no-unused-vars */
import axios from 'axios';
import Cookies from 'js-cookie';
import {
	sendPostSubmitRequest,
	sendPostsRequest,
	sendPostCommentsRequest,
	sendPostsPageRequest,
	sendSinglePostRequest,
	sendPostNumberRequest,
	sendUpvotePostRequest,
	sendDownvotePostRequest,
	sendRemovePostReactionsRequest
} from './Requests/posts.js';
import {
	logout,
	signup,
	login,
	sendReactionsRequest,
	sendUserDataRequest,
	sendChangeIconRequest
} from './Requests/users.js';
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./Worker.js';

const workerInstance = Worker();

// request interceptor to add the auth token header to requests
axios.interceptors.request.use(
	(config) => {
		if (Cookies.get('accessToken')) {
			config.headers.Authorization = `Bearer ${Cookies.get('accessToken')}`;
		}
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

// prevent axios from returning an error and instead just return the response
axios.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		return error.response;
	}
);

// functions to make api calls
const api = {
	sendPostSubmitRequest,
	sendPostsRequest,
	sendPostsPageRequest,
	sendPostCommentsRequest,
	sendSinglePostRequest,
	sendPostNumberRequest,
	sendUpvotePostRequest,
	sendDownvotePostRequest,
	sendRemovePostReactionsRequest,
	logout,
	signup,
	login,
	sendReactionsRequest,
	sendUserDataRequest,
	sendChangeIconRequest
};
export default api;
