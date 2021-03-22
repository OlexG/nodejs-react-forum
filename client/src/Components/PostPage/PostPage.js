import NavbarComponent from '../Navbar/Navbar.js';
import useSinglePostFetch from '../../Hooks/useSinglePostFetch.js';

const PostPage = ({ match }) => {
	const { data, loading } = useSinglePostFetch(match.params.id);

	return (
		<>
			<NavbarComponent/>
			{!loading ?
				(
					<div className='post card mb-2' style = {{ 'margin': '1em' }}>
						<div className = 'card-body'>
							<h2>{data.title}</h2>
							<p>{data.body}</p>
						</div>
					</div>
				) :
				(
					<p>Loading...</p>
				)
			}
		</>
	);
};

export default PostPage;
