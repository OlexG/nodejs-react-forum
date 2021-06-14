import axios from 'axios';
const logout = async () => axios.delete('/api/v1/logout');
const login = async (body) => axios.post('/api/v1/login', body);
const signup = async (body) => axios.post('/api/v1/users', body);
const sendReactionsRequest = async () => axios.get('/api/v1/users/reactions');
const sendUserDataRequest = async () => axios.get('/api/v1/users');
const sendChangeIconRequest = async (data) => axios.post('/api/v1/users/change-icon', data, {
	headers: {
		'Content-Type': 'multipart/form-data'
	}
});
export { logout, login, signup, sendReactionsRequest, sendUserDataRequest, sendChangeIconRequest };
