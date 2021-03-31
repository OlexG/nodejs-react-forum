import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'js-cookie';

const NavbarComponent = () => {
	return (
		<Navbar bg='light' expand='lg'>
			<Navbar.Brand href='#home'>Forum</Navbar.Brand>
			<Navbar.Toggle aria-controls='basic-navbar-nav' />
			<Navbar.Collapse id='basic-navbar-nav'>
				<Nav className='mr-auto'>
					<Nav.Link href='/'>Home</Nav.Link>
				</Nav>
				{Cookies.get('username') ?
					<Navbar.Text>{Cookies.get('username')}</Navbar.Text>
					:
					<React.Fragment>
						<Nav.Link className='mr-sm-2' href='/signup'>Sign Up</Nav.Link>
						<Nav.Link href='/login'>Log In</Nav.Link>
					</React.Fragment>
				}
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavbarComponent;
