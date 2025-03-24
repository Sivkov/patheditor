import { useEffect } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react-lite";
import svgStore from "./stores/svgStore";


const TooltipSwitcher = observer(() => {

	const { t } = useTranslation();
	const { tooltips } = svgStore

	useEffect(() => {
		const tooltip = localStorage.getItem('tooltips');
		if (tooltip === 'on') {
			svgStore.setTooltips(true);
		} else {
			svgStore.setTooltips(false);
		}
	}, []);

	const toggle = (e) => {
		let res =  e.currentTarget.checked
		console.log (res)
		if (res) {
			svgStore.setTooltips(true);
			localStorage.setItem('tooltips', 'on')
		} else {
			svgStore.setTooltips(false);
			localStorage.setItem('tooltips', 'off')
		}
	};

	return (
		<div className="form-check form-switch themeSwitcher d-flex align-items-center">
			<input
				className="form-check-input"
				type="checkbox"
				onChange={toggle}
				style={{ marginLeft: '6px' }}
				checked={ tooltips }
			/>
			<label htmlFor="themeSwitcher" className="form-check-label mx-1" style={{ marginRight: '0px', fontSize: '16px' }}>{t('Tooltips')}</label>
		</div>
	);
});

export default TooltipSwitcher;