import axios from 'axios';
const sendPostsPageRequest = (currentPage, postsPerPage) => axios.get(`/api/v1/posts?page=${currentPage}&number=${postsPerPage}`);
export default sendPostsPageRequest;
