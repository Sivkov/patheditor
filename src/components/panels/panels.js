import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Panel from './panel';
import '@fortawesome/fontawesome-free/css/all.css'
import LogPanel from './logPanel';
import ToolsPanel from './toolsPanel';

const Panels = () => {

	const [inputValue, setInputValue] = useState('');

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

//	function __(w) { return w }

	const panelInfo = [
		  {
			id: 'contourModesPopup',
			mini: false,
			fa: (<><Icon icon="mynaui:square-dashed-solid" width="24" height="24"  style={{color: 'white'}} className='me-2'/><div>Operating modes</div></>),
			style: {
			  top: 0,
			  left: 12,
			  width: 350,
			  height: 520,
			},
			content: (
			  <div className="window-content">
				<div className="d-flex">
				  <table className="table">
					<tbody>
					  <tr>
						<td className="w-50">Cutting</td>
						<td className="w-50">
						  <div className="operating_mode__wrappper">
							<div className="operating_mode cutting"></div>
						  </div>
						</td>
					  </tr>
					  <tr>
						<td className="w-50">Pulse</td>
						<td className="w-50">
						  <div className="operating_mode__wrappper">
							<div className="operating_mode pulse"></div>
						  </div>
						</td>
					  </tr>
					  <tr>
						<td className="w-50">Engraving</td>
						<td className="w-50">
						  <div className="operating_mode__wrappper">
							<div className="operating_mode engraving"></div>
						  </div>
						</td>
					  </tr>
					  <tr>
						<td className="w-50">Process macro 3</td>
						<td className="w-50">
						  <div className="operating_mode__wrappper">
							<div className="operating_mode macro3"></div>
						  </div>
						</td>
					  </tr>
					  <tr>
						<td className="w-50">Process macro 4</td>
						<td className="w-50">
						  <div className="operating_mode__wrappper">
							<div className="operating_mode macro4"></div>
						  </div>
						</td>
					  </tr>
					  <tr>
						<td className="w-50">контур не режем</td>
						<td className="w-50">
						  <div className="operating_mode__wrappper">
							<div className="operating_mode macro5"></div>
						  </div>
						</td>
					  </tr>
					  <tr style={{ backgroundColor: '#212529' }}>
						<td colSpan="2">Пирсинг</td>
					  </tr>
					  <tr>
						<td className="w-50">Normal</td>
						<td className="w-50">
						  <div className="piercing_mode__wrappper">
							<div className="piercing_mode normal"></div>
						  </div>
						</td>
					  </tr>
					  <tr>
						<td className="w-50">Without time</td>
						<td className="w-50">
						  <div className="piercing_mode__wrappper">
							<div className="piercing_mode without_time"></div>
						  </div>
						</td>
					  </tr>
					  <tr>
						<td className="w-50">Pulsed</td>
						<td className="w-50">
						  <div className="piercing_mode__wrappper">
							<div className="piercing_mode pulse"></div>
						  </div>
						</td>
					  </tr>
					  <tr style={{ backgroundColor: '#212529' }}>
						<td colSpan="2">Теги</td>
					  </tr>
					  <tr>
						<td>Перемычка</td>
						<td>
						  <i className="fa-solid fa-xmark"></i>
						</td>
					  </tr>
					</tbody>
				  </table>
				</div>
			  </div>
			),
		  },
	]
return (
	<>
		{panelInfo.map((element, index) => (
			<Panel key={'panel' + index} element={element} index={index} />
		))}
		<LogPanel />
		<ToolsPanel />

	</>
);
};

export default Panels;
