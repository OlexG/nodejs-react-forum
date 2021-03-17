import App from './Components/App/App.js';
import PostCreator from './Components/PostCreator/PostCreator.js';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from "react-router-dom";

const AppRouter = () => {
	return (
		<>
			<Router>
				<Route exact path="/" component={App} />
				<Route path="/create" component={PostCreator} />
			</Router>
		</>
	);
};
ReactDOM.render(<AppRouter/>, document.getElementById('root'));
