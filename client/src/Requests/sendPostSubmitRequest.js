import axios from 'axios';
const sendPostSubmitRequest = (body) => axios.post('/api/v1/posts', body);
export default sendPostSubmitRequest;
