import React, { useState } from 'react';
import Post from '../Post';
import NavbarComponent from '../Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import usePostsNumberFetch from '../../Hooks/usePostsNumberFetch.js';
import usePostsPaginationFetch from '../../Hooks/usePostsPaginationFetch.js';
import PaginationBar from '../Pagination';
import PostMenu from '../PostMenu';
import { POSTS_PER_PAGE } from '../../constants.js';
import './styles.css';
import useReactionsFetch from '../../Hooks/useReactionsFetch.js';
import UserDashboard from '../UserDashboard';
import Cookies from 'js-cookie';
import Popup from '../Popup';
import Notifications from '../Notifications';

const App = () => {
	const [popup, setPopup] = useState({});
	const username = Cookies.get('username');
	const { reactions, loading } = useReactionsFetch(username, setPopup);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterOptions, setFilterOptions] = useState({});
	const totalPosts = usePostsNumberFetch(setPopup).result;
	const posts = usePostsPaginationFetch(
		currentPage,
		POSTS_PER_PAGE,
		filterOptions,
		setPopup
	);
	return (
		<div>
			<NavbarComponent />
			<Notifications username={username} />
			{popup.message && <Popup error message={popup.message} />}
			<div className='row'>
				<div className='list-group-flush align-items-center col-8 align-self-start mt-3'>
					<PostMenu
						setFilterOptions={setFilterOptions}
						filterOptions={filterOptions}
					/>
					{posts && !loading ? (
						posts.map((post, idx) => {
							let status;
							if (
								reactions.downvotes &&
								Object.prototype.hasOwnProperty.call(
									reactions.downvotes,
									post._id
								)
							) {
								status = -1;
							} else if (
								reactions.upvotes &&
								Object.prototype.hasOwnProperty.call(
									reactions.upvotes,
									post._id
								)
							) {
								status = 1;
							} else {
								status = 0;
							}
							return (
								<Post
									key={post._id}
									id={post._id}
									title={post.title}
									body={post.body}
									upvotes={post.upvotes}
									date={post.date}
									status={status}
									author={post.author}
								/>
							);
						})
					) : (
						<p>loading</p>
					)}
				</div>
				<div className='col-3 d-flex flex-column align-items-center'>
					<Link
						className='btn btn-primary align-self-top mt-3 mb-3 pr-5 pl-5'
						to='/create'
					>
						Create a Post
					</Link>
					{totalPosts && (
						<PaginationBar
							currentPage={currentPage}
							setPage={setCurrentPage}
							totalPosts={totalPosts}
							perPage={POSTS_PER_PAGE}
						/>
					)}
					{username && (
						<UserDashboard username={username} setPopup={setPopup} />
					)}
				</div>
			</div>
		</div>
	);
};

export default App;
