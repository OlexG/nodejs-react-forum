import NavbarComponent from '../Navbar/Navbar.js';
import useSinglePostFetch from '../../Hooks/useSinglePostFetch.js';
import useCommentsFetch from '../../Hooks/useCommentsFetch';
import useReactionsFetch from '../../Hooks/useReactionsFetch.js';
import Comment from '../Comment/Comment.js';
const PostPage = ({ match }) => {
	const reactions = useReactionsFetch();
	const { data, loading } = useSinglePostFetch(match.params.id);
	const comments = useCommentsFetch(match.params.id);
	console.log(comments);
	return (
		<>
			<NavbarComponent/>
			{!loading ?
				(
					<div className='post card mb-2' style={{ 'margin': '1em' }}>
						<div className='card-body'>
							<h2>{data.title}</h2>
							<p>{data.body}</p>
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
						return <Comment key={comment._id} id={comment._id} body={comment.body} upvotes={comment.upvotes} date={comment.date} status={status} author={comment.author}/>;
					})
				)
			}
		</>
	);
};

export default PostPage;
