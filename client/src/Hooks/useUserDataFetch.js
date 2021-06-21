import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useUserDataFetch (username) {
	const [data, setData] = useState({});
	useEffect(() => {
		api.sendUserDataRequest(username).then((res) => {
			setData(res.data);
		}).catch((error) => {
			console.log(error);
		});
	}, [username]);
	return data;
}
