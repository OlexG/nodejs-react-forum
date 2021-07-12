/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../constants';
const Notifications = ({ username }) => {
	const [notifications, setNotifications] = useState(
		localStorage.getItem('notifications')
			? JSON.parse(localStorage.getItem('notifications'))
			: []
	);

	// for opening and EventSource with the server
	useEffect(() => {
		function addNotification(message, link) {
			setNotifications((oldArray) => {
				if (!oldArray.some((e) => e.link === link)) {
					return [...oldArray, { message, link }];
				} else {
					return oldArray;
				}
			});
		}
		let eventSource;
		if (username) {
			eventSource = new EventSource(
				`${API_URL}/api/v1/users/${username}/notifications`,
				{ withCredentials: true }
			);
			eventSource.onmessage = (e) => {
				addNotification('A comment was added to your post', e.data);
			};
		}
		return function cleanup() {
			if (eventSource) {
				eventSource.close();
			}
		};
	}, [username]);

	// for updating localStorage
	useEffect(() => {
		localStorage.setItem('notifications', JSON.stringify(notifications));
	}, [notifications]);

	function deleteNotification(link, sync) {
		const newNotifications = notifications.filter((e) => e.link !== link);
		if (sync) {
			// have to syncronously set local storage if we are visiting a new page
			// as setting state may happen too late
			localStorage.setItem('notifications', JSON.stringify(newNotifications));
		}
		setNotifications(newNotifications);
	}

	return (
		<div>
			{notifications.map((el, i) => (
				<div className='alert alert-success' role='alert' key={el.link}>
					<div className='d-flex justify-content-between'>
						<p>{el.message}</p>
						<p
							onClick={() => deleteNotification(el.link)}
							style={{ cursor: 'default' }}
						>
							&#10005;
						</p>
					</div>
					<Link
						to={`/posts/${el.link}`}
						onClick={() => deleteNotification(el.link, true)}
					>
						Visit Post
					</Link>
				</div>
			))}
		</div>
	);
};

export default Notifications;
