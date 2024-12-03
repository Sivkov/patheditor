import React from 'react';
import ThemeSwitcher from './themeSwitcher';
import Intro from './intro';
import Panels from './panels'
 

const Navbar = () => {

	const load = {}
	const parser = {}
	const panels = {}

	return (
		<nav className="navbar conteiner-fluid p-0" id="navBar">
			<div className="d-flex w-100 justify-content-between">
				<div>
					<Intro />
				</div>
				<div className='d-flex'>
					<ThemeSwitcher />
					<a href="https://github.com/Sivkov/arcConverter" className="github-button" target="_blank">
						<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Icon" className="github-icon" width="20" height="20" />
					</a>
				</div>
			</div>
			{/* <Panels /> */}
		</nav>);
};

export default Navbar;



