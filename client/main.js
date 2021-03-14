/* eslint-disable no-undef */
// import React from 'react';
// import ReactDOM from 'react-dom';
const root = document.querySelector('#root');

// eslint-disable-next-line no-undef
class Post extends React.Component {
	render () {
		return (
			<div className="post">
				<p>{this.props.text}</p>
			</div>
		);
	}
}

class App extends React.Component {
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

ReactDOM.render(React.createElement(App), root);
