import api from '../../api.js';
const Reactions = (props) => {
	async function handleUpvote() {
		let res;
		if (props.status === 1) {
			// already liked the post
			res = await api.sendRemovePostReactionsRequest(props.postID);
		} else {
			res = await api.sendUpvotePostRequest(props.postID);
		}
		if (res.status === 200) {
			if (props.status === -1) {
				// already disliked, increase upvotes by 2
				props.setUpvotes(props.upvotes + 2);
				props.setStatus(1);
			} else if (props.status !== 1) {
				props.setUpvotes(props.upvotes + 1);
				props.setStatus(1);
			} else {
				props.setUpvotes(props.upvotes - 1);
				props.setStatus(0);
			}
		}
	}

	async function handleDownvote() {
		let res;
		if (props.status === -1) {
			// already disliked the post
			res = await api.sendRemovePostReactionsRequest(props.postID);
		} else {
			res = await api.sendDownvotePostRequest(props.postID);
		}
		if (res.status === 200) {
			if (props.status === 1) {
				// already liked, decrease upvotes by 2
				props.setUpvotes(props.upvotes - 2);
				props.setStatus(-1);
			} else if (props.status !== -1) {
				props.setUpvotes(props.upvotes - 1);
				props.setStatus(-1);
			} else {
				props.setUpvotes(props.upvotes + 1);
				props.setStatus(0);
			}
		}
	}
	return (
		<>
			<button
				className={`btn btn-outline-secondary ml-3 pl-3 pr-3 ${
					props.status === 1 && 'active'
				}`}
				style={{ height: '40px' }}
				onClick={handleUpvote}
			>
				👍
			</button>
			<button
				className={`btn btn-outline-secondary ml-3 pl-3 pr-3 ${
					props.status === -1 && 'active'
				}`}
				style={{ height: '40px' }}
				onClick={handleDownvote}
			>
				👎
			</button>
		</>
	);
};

export default Reactions;
