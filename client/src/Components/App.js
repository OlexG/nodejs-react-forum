import React from 'react';
import Post from './Post.js';

export default class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			posts: [{ text: 'test1' }, { text: 'test2' }, { text: 'test3' }]
		};
	}

	async componentDidMount () {
		// fetch data from server here
	}

	render () {
		console.log(this.state.posts);
		return (
			<div>
				{this.state.posts ?
					(
						this.state.posts.map((d, idx) => { return <Post key = {idx} text = {d.text}/>; })
					) :
					(
						<p>loading</p>
					)
				}
			</div>
		);
	}
}