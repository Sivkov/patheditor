import React from 'react';
import { useTranslation } from 'react-i18next';


const LanguageSwitcher = () => {

	const { t,i18n } = useTranslation();
	const changeLanguage = (lng) => {
		localStorage.setItem('lng', lng)
		i18n.changeLanguage(lng);
	};


	return (
		<div className="nav-item dropdown" id="viewsDropDown">
			<a
				className="nav-link dropdown-toggle"
				href="#"
				id="viewsDropdown"
				role="button"
				data-bs-toggle="dropdown"
				aria-expanded="false"
			>
				{t('Language')}
			</a>
			<ul className="dropdown-menu" aria-labelledby="viewsDropdown">
				<li>
					<a
						className="dropdown-item"
						href="#"
						onClick={() => changeLanguage('en')}
					>
						{t('English')}
					</a>
				</li>
				<li>
					<a
						className="dropdown-item"
						href="#"
						onClick={() => changeLanguage('ru')}
					>
						{t("Russian")}
					</a>
				</li>
			</ul>
		</div>
	);
};

export default LanguageSwitcher;