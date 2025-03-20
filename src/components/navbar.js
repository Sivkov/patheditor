import React from 'react';
import ThemeSwitcher from './themeSwitcher';
import Intro from './intro';
import NavButtons from './navButtons';

const Navbar = () => {

	return (
		<nav className="navbar conteiner-fluid p-0" id="navBar">
			<div className="d-flex w-100 justify-content-between">
				<div className="d-flex">
					<Intro />
					<NavButtons />
				</div>
				<div className='d-flex align-items-center'>
					<ThemeSwitcher />					
				</div>
			</div>
		</nav>);
};

export default Navbar;



