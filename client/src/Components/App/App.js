import React, { useState, useEffect } from 'react';
import Post from '../Post/Post.js';
import NavbarComponent from '../Navbar/Navbar.js';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import usePostsNumberFetch from '../../Hooks/usePostsNumberFetch.js';
import PaginationBar from '../Pagination/Pagination.js';

const App = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPosts = usePostsNumberFetch().result;
	const postsPerPage = 10;
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		// get post data from server here
		fetch(`/posts/${currentPage}/${postsPerPage}`).then(res =>
			res.json()
		).then((res) => {
			setPosts(res);
		});
	}, [currentPage]);

	return (
		<div>
			<NavbarComponent/>
			<div className='row'>
				<div className='d-flex flex-column align-items-center col-8 align-self-start'>
					{posts ?
						(
							posts.map((post, idx) => {
								return <Post key={post._id} title={post.title} body={post.body}/>;
							})
						) :
						(
							<p>loading</p>
						)
					}
				</div>
				<div className='col-3 d-flex flex-column align-items-center'>
					<Link className='btn btn-primary align-self-top mt-3 mb-3 pr-5 pl-5' to='/create'>Create a Post</Link>
					{ totalPosts && <PaginationBar currentPage={currentPage} setPage={setCurrentPage} totalPosts={totalPosts} perPage={postsPerPage}/> }
				</div>
			</div>
		</div>
	);
};

export default App;
