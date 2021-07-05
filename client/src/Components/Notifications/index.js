/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Notifications = ({ username }) => {
	const [notifications, setNotificaions] = useState(
		localStorage.getItem('notifications')
			? JSON.parse(localStorage.getItem('notifications'))
			: []
	);

	// for opening and EventSource with the server
	useEffect(() => {
		if (username) {
			const eventSource = new EventSource(
				`http://localhost:3001/api/v1/users/${username}/notifications`,
				{ withCredentials: true }
			);
			eventSource.onmessage = (e) => {
				addNotification('A comment was added to your post', e.data);
			};
		}
		// removed addNotification as this function reference every rerender
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username]);

	// for updating localStorage
	useEffect(() => {
		localStorage.setItem('notifications', JSON.stringify(notifications));
	}, [notifications]);

	function addNotification(message, link) {
		setNotificaions((oldArray) => {
			if (!oldArray.some((e) => e.link === link)) {
				return [...oldArray, { message, link }];
			} else {
				return oldArray;
			}
		});
	}

	function deleteNotification(link) {
		const newNotifications = notifications.filter((e) => e.link !== link);
		setNotificaions(newNotifications);
	}

	return (
		<div>
			{notifications.map((el, i) => (
				// order will not change so using index as key
				<div className='alert alert-success' role='alert' key={el.link}>
					<div className='d-flex justify-content-between'>
						<p>{el.message}</p>
						<p
							onClick={() => deleteNotification(el.link)}
							style={{ cursor: 'default' }}
						>
							x
						</p>
					</div>
					<Link
						to={`/posts/${el.link}`}
						onClick={() => deleteNotification(el.link)}
					>
						Visit Post
					</Link>
				</div>
			))}
		</div>
	);
};

export default Notifications;
