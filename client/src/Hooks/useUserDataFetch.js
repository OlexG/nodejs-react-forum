import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useUserDataFetch () {
	const [data, setData] = useState({});
	useEffect(() => {
		api.sendUserDataRequest().then((res) => {
			setData(res.data);
		}).catch((error) => {
			console.log(error);
		});
	}, []);
	return data;
}
