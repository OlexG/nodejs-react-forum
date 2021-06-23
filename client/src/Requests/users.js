import axios from 'axios';
const logout = async () => axios.delete('/api/v1/logout');
const login = async (body) => axios.post('/api/v1/login', body);
const signup = async (body) => axios.post('/api/v1/users', body);
const sendReactionsRequest = async (username) =>
	axios.get(`/api/v1/users/${username}/reactions`);
const sendUserDataRequest = async (username) =>
	axios.get(`/api/v1/users/${username}`);
const sendChangeIconRequest = async (data, username) =>
	axios.post(`/api/v1/users/${username}/icon`, data, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
export {
	logout,
	login,
	signup,
	sendReactionsRequest,
	sendUserDataRequest,
	sendChangeIconRequest
};
