import axios from 'axios';
const sendSinglePostRequest = (id) => axios.get(`/api/v1/posts/${id}`);
export default sendSinglePostRequest;
