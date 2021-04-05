import axios from 'axios';
const logout = () => axios.delete('/api/v1/logout');
export default logout;
