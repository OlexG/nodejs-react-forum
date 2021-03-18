import React from 'react';
import Post from '../Post/Post.js';
import NavbarComponent from '../Navbar/Navbar.js';
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from 'react-router-dom';
import usePostsFetch from '../../Hooks/usePostsFetch.js';

const App = () => {
	const posts = usePostsFetch();
	return (
		<div>
			<NavbarComponent/>
			<div className = 'row'>
				<div className = 'd-flex flex-column align-items-center col-9 align-self-start'>
					{posts ?
						(
							posts.map((post, idx) => { 
								return <Post key = {post._id} title = {post.title} body = {post.body}/>; 
							})
						) :
						(
							<p>loading</p>
						)
					}
				</div>
				<Link className='btn btn-primary col-2 align-self-top h-25 m-3' to = '/create'>Create a Post</Link>
			</div>
		</div>
	);
};

export default App;