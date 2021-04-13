import React, { useState } from 'react';
import Post from '../Post/Post.js';
import NavbarComponent from '../Navbar/Navbar.js';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import usePostsNumberFetch from '../../Hooks/usePostsNumberFetch.js';
import usePostsPaginationFetch from '../../Hooks/usePostsPaginationFetch.js';
import PaginationBar from '../Pagination/Pagination.js';
import { POSTS_PER_PAGE } from '../../constants.js';
import './styles.css';

const App = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPosts = usePostsNumberFetch().result;
	const posts = usePostsPaginationFetch(currentPage, POSTS_PER_PAGE);
	return (
		<div>
			<NavbarComponent/>
			<div className='row'>
				<div className='list-group-flush align-items-center col-8 align-self-start mt-3'>
					{posts ?
						(
							posts.map((post, idx) => {
								return <Post key={post._id} id={post._id} title={post.title} body={post.body}/>;
							})
						) :
						(
							<p>loading</p>
						)
					}
				</div>
				<div className='col-3 d-flex flex-column align-items-center'>
					<Link className='btn btn-primary align-self-top mt-3 mb-3 pr-5 pl-5' to='/create'>Create a Post</Link>
					{ totalPosts && <PaginationBar currentPage={currentPage} setPage={setCurrentPage} totalPosts={totalPosts} perPage={POSTS_PER_PAGE}/> }
				</div>
			</div>
		</div>
	);
};

export default App;
