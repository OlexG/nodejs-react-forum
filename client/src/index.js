import App from './Components/App';
import PostCreator from './Components/PostCreator';
import PostPage from './Components/PostPage';
import LoginPage from './Components/LoginPage';
import SignupPage from './Components/SignupPage';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const AppRouter = () => {
	return (
		<>
			<Router>
				<Route exact path='/' component={App} />
				<Route path='/create' component={PostCreator} />
				<Route path='/comment' component={PostCreator} />
				<Route path='/posts/:id' component={PostPage} />
				<Route path='/login' component={LoginPage} />
				<Route path='/signup' component={SignupPage} />
			</Router>
		</>
	);
};
ReactDOM.render(<AppRouter />, document.getElementById('root'));
