import React, { useState, useEffect } from 'react';
import Post from '../Post/Post.js';
import NavbarComponent from '../Navbar/Navbar.js';
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		//get post data from server here
		setPosts([{text:'test1'},{text:'test2'},{text:'test3'}]);
	}, []);

	return (
		<div>
			<NavbarComponent/>
			<div className = 'row'>
				<div className = 'd-flex flex-column align-items-center col-9 align-self-start'>
					{posts ?
						(
							posts.map((d, idx) => { return <Post key = {idx} text = {d.text}/>; })
						) :
						(
							<p>loading</p>
						)
					}
				</div>
				<a type='button' className='btn btn-primary col-2 align-self-top h-25 m-3' href = '/create'>Create a Post</a>
			</div>
		</div>
	);
};

export default App;