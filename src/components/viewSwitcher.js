import React from 'react';
import { observer } from 'mobx-react-lite'; 
import PanelStore from './stores/panelStore';
import panelStore from './stores/panelStore';
   

const viewSwitcher = observer(() => {

	const minimize_all_panels = () => {
		console.log('minimize_all_panels')
		panelStore.minimize_all_panels()

	}

	return (
		<>
		<div className="nav-item dropdown" id="viewsDropDown">
			<a
				className="nav-link dropdown-toggle"
				href="#"
				id="viewsDropdown"
				role="button"
				data-bs-toggle="dropdown"
				aria-expanded="false"
			>
				View
			</a>
			<ul className="dropdown-menu" aria-labelledby="viewsDropdown">
				{/* <li>
				<a className="dropdown-item" href="#" id="fit_to_page">
					<i className="fa-sharp fa-solid fa-arrows-maximize" />
					Fit to page
				</a>
				</li> */}
				<li>
				<a
					className="dropdown-item"
					href="#"
					onclick={ minimize_all_panels }
				>
					<i className="fa-solid fa-align-justify me-2" />
					Minimize all panels
				</a>
				</li>
			</ul>
			</div>

		</>
	);
});

export default viewSwitcher;



