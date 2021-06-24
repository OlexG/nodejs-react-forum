import axios from 'axios';
import { REFRESH_TOKEN_TIME } from './constants.js';
setInterval(() => {
	// try to get the accessToken, retry is true to have the interceptor ignore this request
	axios.get('/api/v1/token', { _retry: true });
}, REFRESH_TOKEN_TIME);
