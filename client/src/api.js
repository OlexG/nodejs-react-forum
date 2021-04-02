import axios from 'axios';
import Cookies from 'js-cookie';

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
				.get('api/v1/token')
				.then((res) => {
					if (res.status === 200) {
						return axios(originalRequest);
					}
				});
		}
		return Promise.reject(error);
	}
);
// functions to make api calls
const api = {
	'sendPostSubmitRequest': (body) => {
		return axios.post('/api/v1/posts', body);
	},
	'sendPostsRequest': () => {
		return axios.get('/api/v1/posts');
	},
	'sendPostsPageRequest': (currentPage, postsPerPage) => {
		return axios.get(`/api/v1/posts?page=${currentPage}&number=${postsPerPage}`);
	},
	'sendSinglePostRequest': (id) => {
		return axios.get(`/api/v1/posts/${id}`);
	},
	'sendPostNumberRequest': () => {
		return axios.get('/api/v1/posts-number');
	},
	'logout': () => {
		return axios.delete('/api/v1/logout');
	},
	'signup': (body) => {
		return axios.post('/api/v1/users', body);
	},
	'login': (body) => {
		return axios.post('/api/v1/login', body);
	}
};
export default api;
