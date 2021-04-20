import api from '../../api.js';
const Reactions = (props) => {
	async function handleUpvote () {
		const res = await api.sendUpvotePostRequest(props.postID);
		if (res.status === 200) {
			if (props.status === -1) {
				// already disliked, increase upvotes by 2
				props.setUpvotes(props.upvotes + 2);
			} else if (props.status !== 1) {
				props.setUpvotes(props.upvotes + 1);
			}
			props.setStatus(1);
		}
	}

	async function handleDownvote () {
		const res = await api.sendDownvotePostRequest(props.postID);
		if (res.status === 200) {
			if (props.status === 1) {
				// already liked, decrease upvotes by 2
				props.setUpvotes(props.upvotes - 2);
			} else if (props.status !== -1) {
				props.setUpvotes(props.upvotes - 1);
			}
			props.setStatus(-1);
		}
	}
	return (
		<>
			<button className={`btn btn-outline-secondary ml-3 pl-3 pr-3 ${(props.status === 1 && 'active')}`} style={{ 'height': '40px' }} onClick={handleUpvote}>👍</button>
			<button className={`btn btn-outline-secondary ml-3 pl-3 pr-3 ${(props.status === -1 && 'active')}`} style={{ 'height': '40px' }} onClick={handleDownvote}>👎</button>
		</>
	);
};

export default Reactions;
