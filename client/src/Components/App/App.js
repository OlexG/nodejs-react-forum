import React, { useState, useEffect } from 'react';
import Post from '../Post/Post.js';
import NavbarComponent from '../Navbar/Navbar.js';
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from 'react-router-dom';
const App = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		//get post data from server here
		fetch('/posts').then(res => 
			res.json()
		).then((res) =>{
			console.log(res);
			setPosts(res);
		});
	}, []);

	return (
		<div>
			<NavbarComponent/>
			<div className = 'row'>
				<div className = 'd-flex flex-column align-items-center col-9 align-self-start'>
					{posts ?
						(
							posts.filter((post) => {
								return typeof post.title == 'string' && typeof post.body == 'string';
							}).map((post, idx) => { 
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