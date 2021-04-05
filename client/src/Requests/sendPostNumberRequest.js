import axios from 'axios';
const sendPostNumberRequest = () => axios.get('/api/v1/posts-number');
export default sendPostNumberRequest;
