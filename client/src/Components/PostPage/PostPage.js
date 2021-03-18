import React, { useState, useEffect } from 'react';
import NavbarComponent from '../Navbar/Navbar.js';

const PostPage = ({ match }) => {

	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState();

	useEffect(() => {
		fetch(`/posts/${match.params.id}`, {}).then((res) => 
			res.json()
		).then((res) => {
			if (typeof res.title === 'string' && typeof res.body == 'string'){
				setData(res);
				setIsLoading(false);
			}
		}).catch((error) => 
			console.log(error)
		);
	}, [match.params.id]);

	return (
		<>
			<NavbarComponent/>
			{!isLoading ? 
				(
					<div className='post card mb-2' style = {{'margin':'1em'}}>
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