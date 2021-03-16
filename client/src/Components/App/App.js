import React, { useState, useEffect } from 'react';
import Post from '../Post/Post.js';
import NavbarComponent from '../Navbar/Navbar.js';
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		//get post data from server here
		setPosts([{text:"test1"},{text:"test2"},{text:"test3"}]);
	}, []);

	return (
		<div>
			<NavbarComponent/>
			<div className = "d-flex flex-column" style = {{"alignItems":"center"}}>
				{posts ?
					(
						posts.map((d, idx) => { return <Post key = {idx} text = {d.text}/>; })
					) :
					(
						<p>loading</p>
					)
				}
			</div>
		</div>
	);
};

export default App;