import axios from 'axios';
const sendPostsRequest = () => axios.get('/api/v1/posts');
export default sendPostsRequest;
