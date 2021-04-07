import axios from 'axios';
const logout = async () => axios.delete('/api/v1/logout');
const login = async (body) => axios.post('/api/v1/login', body);
const signup = async (body) => axios.post('/api/v1/users', body);

export { logout, login, signup };
