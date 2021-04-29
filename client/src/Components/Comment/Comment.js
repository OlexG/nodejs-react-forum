import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import useCommentsFetch from '../../Hooks/useCommentsFetch';
import useReactionsFetch from '../../Hooks/useReactionsFetch.js';
import Reactions from '../Reactions/Reactions.js';
import { MAX_COMMENT_DEPTH } from '../../constants.js';

const Comment = (props) => {
	const { reactions, loading } = useReactionsFetch();
	const [upvotes, setUpvotes] = useState(props.upvotes);
	const [status, setStatus] = useState(props.status);
	const [loadComments, setLoadComments] = useState(false);
	const comments = useCommentsFetch(props.id);
	return (
		<>
			<div className='p-2 ml-5' style={{ 'width': '90%' }}>
				<div className='list-group-item'>
					<h6>By: {props.author}</h6>
					<p>{props.body}</p>
					<div className='align-items-center d-flex flex-row'>
						<Link to={`/comment?parentId=${props.id}&originalId=${props.original}`}>Reply</Link>
						{ props.depth > MAX_COMMENT_DEPTH &&
						(
							<>
								<p className='btn btn-link m-0 pr-0 pl-3 pt-0 pb-0' onClick={() => { setLoadComments(true); }}>Load replies</p>
								<p className='btn btn-link m-0 pr-0 pl-3 pt-0 pb-0' onClick={() => { setLoadComments(false); }}>Hide replies</p>
							</>
						)
						}
						<Reactions postID={props.id} setUpvotes={setUpvotes} upvotes={upvotes} status={status} setStatus={setStatus} className=''/>
						<p className='upvotes m-0 pr-0 pl-3 pt-0 pb-0'>{upvotes}</p>
					</div>
				</div>
			</div>
			<div className='ml-5'>
				{(comments && (loadComments || props.depth <= MAX_COMMENT_DEPTH) && !loading) &&
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
						return <Comment depth={props.depth + 1} original={props.original} key={comment._id} id={comment._id} body={comment.body} upvotes={comment.upvotes} date={comment.date} status={status} author={comment.author}/>;
					})
				)
				}
			</div>
		</>
	);
};

export default Comment;
