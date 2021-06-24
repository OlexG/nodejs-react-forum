/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { MAX_COMMENT_DEPTH } from '../../constants.js';
import Reactions from '../Reactions';
import api from '../../api.js';

const repliesStateOptions = {
	UNLOADED: 'unloaded',
	SHOWN: 'shown',
	HIDDEN: 'hidden'
};

const Comment = (props) => {
	const [upvotes, setUpvotes] = useState(props.upvotes);
	const [status, setStatus] = useState(props.status);
	const [showChildren, setShowChildren] = useState(
		repliesStateOptions.UNLOADED
	);
	const [comments, setComments] = useState([]);
	async function fetchComments() {
		if (showChildren === repliesStateOptions.UNLOADED) {
			const res = await api.sendPostCommentsRequest(props.id, false);
			setComments(res.data);
		}
		setShowChildren(repliesStateOptions.SHOWN);
	}
	return (
		<>
			<div className='p-2 ml-5' style={{ width: '90%' }}>
				<div className='list-group-item'>
					<h6>By: {props.author}</h6>
					<p>{props.body}</p>
					<div className='align-items-center d-flex flex-row'>
						<Link
							to={`/comment?parentId=${props.id}&originalId=${props.original}`}
						>
							Reply
						</Link>
						{props.depth >= MAX_COMMENT_DEPTH && (
							<>
								<p
									className='btn btn-link m-0 pr-0 pl-3 pt-0 pb-0'
									onClick={fetchComments}
								>
									Load replies
								</p>
								<p
									className='btn btn-link m-0 pr-0 pl-3 pt-0 pb-0'
									onClick={() => {
										setShowChildren(repliesStateOptions.HIDDEN);
									}}
								>
									Hide replies
								</p>
							</>
						)}
						<Reactions
							postID={props.id}
							setUpvotes={setUpvotes}
							upvotes={upvotes}
							status={status}
							setStatus={setStatus}
							className=''
						/>
						<p className='upvotes m-0 pr-0 pl-3 pt-0 pb-0'>{upvotes}</p>
					</div>
				</div>
			</div>
			<div className='ml-5'>
				{props.children &&
					props.children.map((comment, idx) => {
						let status;
						if (
							props.reactions.downvotes &&
							Object.prototype.hasOwnProperty.call(
								props.reactions.downvotes,
								comment._id
							)
						) {
							status = -1;
						} else if (
							props.reactions.upvotes &&
							Object.prototype.hasOwnProperty.call(
								props.reactions.upvotes,
								comment._id
							)
						) {
							status = 1;
						} else {
							status = 0;
						}
						return (
							<Comment
								reactions={props.reactions}
								children={comment.children}
								depth={props.depth + 1}
								original={props.original}
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
				{showChildren === 'shown' &&
					comments &&
					// react converts 1 elemenet object arrays to just that object in state
					comments.map((comment, idx) => {
						let status;
						if (
							props.reactions.downvotes &&
							Object.prototype.hasOwnProperty.call(
								props.reactions.downvotes,
								comment._id
							)
						) {
							status = -1;
						} else if (
							props.reactions.upvotes &&
							Object.prototype.hasOwnProperty.call(
								props.reactions.upvotes,
								comment._id
							)
						) {
							status = 1;
						} else {
							status = 0;
						}
						return (
							<Comment
								reactions={props.reactions}
								children={comment.children}
								depth={props.depth + 1}
								original={props.original}
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
			</div>
		</>
	);
};

export default Comment;
