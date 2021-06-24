import { useState, useEffect } from 'react';
import api from '../api.js';
export default function useUserDataFetch(username, setPopup) {
	const [data, setData] = useState({});
	useEffect(() => {
		async function fetchData() {
			if (!username) {
				setPopup({ message: 'Please login again' });
				return;
			}
			try {
				const res = await api.sendUserDataRequest(username);
				if (res.status === 200) {
					setData(res.data);
				} else {
					setPopup({ message: 'Something went wrong when fetching user data' });
				}
			} catch (e) {
				setPopup({ message: 'Something went wrong when fetching user data' });
			}
		}
		fetchData();
	}, [username, setPopup]);
	return data;
}
