import React from 'react';
import { observer } from 'mobx-react-lite'; 
import panelStore from './stores/panelStore';
import coordStore from './stores/coordsStore';
import CONSTANTS from '../constants/constants';
import { Icon } from '@iconify/react';
import LanguageSwitcher from './languageSwitcher';
import { useTranslation } from 'react-i18next';
import Part from '../scripts/part';
   

const NavButtons = observer(() => {
	
	const {t} = useTranslation();

	const minimize_all_panels = () => {
		for (let key in CONSTANTS.panelPostions) {
			panelStore.setPosition(key, CONSTANTS.panelPostions[key])
		}	 
		localStorage.removeItem("ppp");
	}

	const fit = () => {
		console.log ('Fit *** Fit *** Fit *** Fit *** Fit *** Fit *** Fit')
		coordStore.setNeedToFit(true)
	}

	const save = () =>{
		Part.savePart()
	}

	return (
	<>
		<div className="d-flex">
			<a
				className="nav-link dropdown-toggle"
				href="#"
 				role="button"
				id="viewsDropdown1"
 				data-bs-toggle="dropdown"
				aria-expanded="false"
			>
				{t('Part')}
			</a>
			<ul className="dropdown-menu" aria-labelledby="viewsDropdown1">
				<li>
					<a className="dropdown-item" 
						href="#" 
						id="fit_to_page"
						onClick={ save }					
						>
						<Icon icon="fluent:save-16-filled" className='me-2' width="18" height="18"/>
						{t('Save')}
					</a>
				</li>
			</ul>
			<a
				className="nav-link"
				href="#"
				role="button"
				onClick={(e) => {
					e.preventDefault(); 
					window.location.reload();
				}}
			>
				{t('Reload')}
			</a>	
			<a
				className="nav-link"
				href="#"
 				role="button"
 			>
				{t('Tasks')}
			</a>			
			<a
				className="nav-link"
				href="#"
 				role="button"
  			>
				{t('Plan')} {t('Editor')}
			</a>
			<LanguageSwitcher />
			<div className="nav-item dropdown" id="viewsDropDown">
				<a
					className="nav-link dropdown-toggle"
					href="#"
					id="viewsDropdown"
					role="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>{t('View')}</a>
				<ul className="dropdown-menu" aria-labelledby="viewsDropdown">
					<li>
						<a className="dropdown-item" 
							href="#" 
							id="fit_to_page"
							onClick={ fit }					
							>
							<Icon icon="fluent:scale-fit-24-filled" width="18" height="30" className="me-2" />
							{t('Fit to page')}
						</a>
					</li> 
					<li>
						<a  className="dropdown-item"
							href="#"
							onClick={ minimize_all_panels }
						>
							<i className="fa-solid fa-align-justify me-2" />
							{t('Minimize all panels')}
						</a>
					</li>
				</ul>
			</div>
			<a
				className="nav-link"
				href="#"
				id="viewsDropdown"
				role="button"
 			>
				{t('Exit')}
			</a>			
		</div>
	</>
	);
});

export default NavButtons;



