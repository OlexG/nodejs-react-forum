import React, { useState, useEffect } from 'react';
import NavbarComponent from '../Navbar/Navbar.js';
import useSinglePostFetch from '../../Hooks/useSinglePostFetch.js';
import useCommentsFetch from '../../Hooks/useCommentsFetch';
import useReactionsFetch from '../../Hooks/useReactionsFetch.js';
import Comment from '../Comment/Comment.js';
import Reactions from '../Reactions/Reactions.js';
import { Link } from 'react-router-dom';

const PostPage = ({ match }) => {
	const reactions = useReactionsFetch();
	const [upvotes, setUpvotes] = useState(0);
	const [status, setStatus] = useState(0);
	const { data, loading } = useSinglePostFetch(match.params.id);
	const comments = useCommentsFetch(match.params.id);

	useEffect(() => {
		if (reactions.downvotes && Object.prototype.hasOwnProperty.call(reactions.downvotes, match.params.id)) {
			setStatus(-1);
		} else if (reactions.upvotes && Object.prototype.hasOwnProperty.call(reactions.upvotes, match.params.id)) {
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
			<NavbarComponent/>
			{!loading ?
				(
					<div className='post card mb-2' style={{ 'margin': '1em' }}>
						<div className='card-body'>
							<h2>{data.title}</h2>
							<p>{data.body}</p>
							<div className='align-items-center d-flex flex-row'>
								<Link to={`/comment?parentId=${match.params.id}&originalId=${match.params.id}`}>Reply</Link>
								<Reactions postID={match.params.id} setUpvotes={setUpvotes} upvotes={upvotes} status={status} setStatus={setStatus} className=''/>
								<p className='upvotes pr-0 pl-3 pt-0 pb-0 m-0'>{upvotes}</p>
							</div>
						</div>
					</div>
				) :
				(
					<p>Loading...</p>
				)
			}
			{comments &&
				(
					comments.map((comment, idx) => {
						let status;
						if (reactions.downvotes && Object.prototype.hasOwnProperty.call(reactions.downvotes, comment._id)) {
							status = -1;
						} else if (reactions.upvotes && Object.prototype.hasOwnProperty.call(reactions.upvotes, comment._id)) {
							status = 1;
						} else {
							status = 0;
						}
						return <Comment depth={1} original={match.params.id} key={comment._id} id={comment._id} body={comment.body} upvotes={comment.upvotes} date={comment.date} status={status} author={comment.author}/>;
					})
				)
			}
		</>
	);
};

export default PostPage;
