import App from './Components/App/App.js';
import PostCreator from './Components/PostCreator/PostCreator.js';
import PostPage from './Components/PostPage/PostPage.js';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

const AppRouter = () => {
	return (
		<>
			<Router>
				<Route exact path='/' component={App} />
				<Route path='/create' component={PostCreator} />
				<Route path='/posts/:id' component={PostPage} />
			</Router>
		</>
	);
};
ReactDOM.render(<AppRouter/>, document.getElementById('root'));
