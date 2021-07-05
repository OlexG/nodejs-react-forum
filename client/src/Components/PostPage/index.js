import React, { useState, useEffect } from 'react';
import NavbarComponent from '../Navbar';
import useSinglePostFetch from '../../Hooks/useSinglePostFetch.js';
import useCommentsFetch from '../../Hooks/useCommentsFetch';
import useReactionsFetch from '../../Hooks/useReactionsFetch.js';
import Comment from '../Comment';
import Reactions from '../Reactions';
import { Link } from 'react-router-dom';
import styles from '../UserDashboard/UserDashboard.module.css';
import Popup from '../Popup';
import Cookies from 'js-cookie';
import Notifications from '../Notifications';

const PostPage = ({ match }) => {
	const [popup, setPopup] = useState({});
	const username = Cookies.get('username');
	const { reactions, loading: reactionsLoading } = useReactionsFetch(
		username,
		setPopup
	);
	const [upvotes, setUpvotes] = useState(0);
	const [status, setStatus] = useState(0);
	const { data, loading } = useSinglePostFetch(match.params.id, setPopup);
	const comments = useCommentsFetch(match.params.id, setPopup);
	useEffect(() => {
		if (
			reactions.downvotes &&
			Object.prototype.hasOwnProperty.call(reactions.downvotes, match.params.id)
		) {
			setStatus(-1);
		} else if (
			reactions.upvotes &&
			Object.prototype.hasOwnProperty.call(reactions.upvotes, match.params.id)
		) {
			setStatus(1);
		} else {
			setStatus(0);
		}
		if (data) {
			setUpvotes(data.upvotes);
		}
	}, [match.params.id, reactions.downvotes, reactions.upvotes, data]);

	return (
		<>
			<NavbarComponent />
			<Notifications username={username} />
			{popup.message && <Popup error message={popup.message} />}
			{!loading ? (
				<div className='post card mb-2' style={{ margin: '1em' }}>
					<div className='card-body'>
						<div
							className={styles.imgContainer}
							style={{
								'background-image': `url("/api/v1/users/${data.author}/icon")`
							}}
						/>
						<p>By: {data.author}</p>
						<h2>{data.title}</h2>
						<p>{data.body}</p>
						<div className='align-items-center d-flex flex-row'>
							<Link
								to={`/comment?parentId=${match.params.id}&originalId=${match.params.id}`}
							>
								Reply
							</Link>
							<Reactions
								postID={match.params.id}
								setUpvotes={setUpvotes}
								upvotes={upvotes}
								status={status}
								setStatus={setStatus}
								className=''
							/>
							<p className='upvotes pr-0 pl-3 pt-0 pb-0 m-0'>{upvotes}</p>
						</div>
					</div>
				</div>
			) : (
				<p>Loading...</p>
			)}
			{comments &&
				!reactionsLoading &&
				comments.map((comment, idx) => {
					let status;
					if (
						reactions.downvotes &&
						Object.prototype.hasOwnProperty.call(
							reactions.downvotes,
							comment._id
						)
					) {
						status = -1;
					} else if (
						reactions.upvotes &&
						Object.prototype.hasOwnProperty.call(reactions.upvotes, comment._id)
					) {
						status = 1;
					} else {
						status = 0;
					}
					return (
						<Comment
							reactions={reactions}
							depth={1}
							original={match.params.id}
							children={comment.children}
							key={comment._id}
							id={comment._id}
							body={comment.body}
							upvotes={comment.upvotes}
							date={comment.date}
							status={status}
							author={comment.author}
						/>
					);
				})}
		</>
	);
};

export default PostPage;
