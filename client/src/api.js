/* eslint-disable no-unused-vars */
import axios from 'axios';
import Cookies from 'js-cookie';
import sendPostSubmitRequest from './Requests/sendPostSubmitRequest.js';
import sendPostsRequest from './Requests/sendPostsRequest.js';
import sendPostsPageRequest from './Requests/sendPostsPageRequest.js';
import sendSinglePostRequest from './Requests/sendSinglePostRequest.js';
import sendPostNumberRequest from './Requests/sendPostNumberRequest.js';
import logout from './Requests/logout.js';
import signup from './Requests/signup.js';
import login from './Requests/login.js';
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
// response interceptor to refresh token on receiving token expired error
axios.interceptors.response.use(
	(response) => {
		return response;
	},
	function (error) {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			return axios
				.get('api/v1/token', { '_retry': true })
				.then((res) => {
					if (res.status === 200) {
						return axios(originalRequest);
					} else {
						return res;
					}
				});
		}
		Promise.reject(error);
		return { 'status': 401 };
	}
);
// functions to make api calls
const api = {
	sendPostSubmitRequest,
	sendPostsRequest,
	sendPostsPageRequest,
	sendSinglePostRequest,
	sendPostNumberRequest,
	logout,
	signup,
	login
};
export default api;
