import App from './Components/App/App.js';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from "react-router-dom";

const AppRouter = () => {
	return (
		<>
			<Router>
				<Route exact path="/" component={App} />
			</Router>
		</>
	);
};
ReactDOM.render(<AppRouter/>, document.getElementById('root'));
