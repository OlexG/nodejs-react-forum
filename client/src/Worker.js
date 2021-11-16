import axios from 'axios';
import { REFRESH_TOKEN_TIME } from './constants.js';
import Cookies from 'js-cookie';

setInterval(() => {
	// try to get the accessToken, retry is true to have the interceptor ignore this request
	axios.get('/api/v1/token', { _retry: true }).then((res) => {
		if (res.headers.accessToken) {
			Cookies.set('accessToken', res.headers.accessToken);
		}
	});
}, REFRESH_TOKEN_TIME);
