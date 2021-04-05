import axios from 'axios';
const login = (body) => axios.post('/api/v1/login', body);
export default login;
