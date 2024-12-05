import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Panel from './panel';
import Util from './../utils/util';
import '@fortawesome/fontawesome-free/css/all.css'

const Panels = () => {

	const [inputValue, setInputValue] = useState('');

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	function __(w) { return w }

	const panelInfo = [
		{
			id: "toolsPopup",
			mini: false,
			fa: (<Icon icon="heroicons:wrench-screwdriver-20-solid" />),
			style: {
			  top: 40,
			  left: 300,
			  width: 150,
			  height: "auto",
			},
			content: (
				<div className="d-flex align-items-center btn_block flex-wrap">
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_tool btn_resize_mode"
				  >
					<i className="fa-solid fa-arrow-pointer"></i>
				  </button>
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_tool btn_drag_mode"
				  >
					<i className="fa-solid fa-hand"></i>
				  </button>
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_mode btn_tool btn_add_point"
				  >
					<div className="d-flex flex-row align-items-center justify-content-center">
					  <i className="fa-solid fa-arrow-pointer"></i>
					  <div style={{ marginTop: 11 }}>+</div>
					</div>
				  </button>
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_copy btn_tool"
				  >
					<i className="fa-solid fa-copy"></i>
				  </button>
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_tool btn_selectPoint_mode"
				  >
					<Icon icon="gis:arrow-o" width="24" height="24"  style={{color: 'white'}} />
				  </button>
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_rounding btn_tool"
				  >
					<Icon icon="proicons:arc" width="24" height="24" style={{color: 'white'}} />
				  </button>
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_paste btn_tool"
				  >
					<i className="fa-solid fa-file-import"></i>
				  </button>
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_reverse_path btn_tool"
				  >
					<i className="fa-solid fa-rotate"></i>
				  </button>
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_shapes btn_tool"
				  >
					<i className="fa-solid fa-shapes"></i>
				  </button>
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_text btn_tool"
				  >
					<Icon icon="tabler:text-size" width="24" height="24" />
				  </button>
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_new_outer btn_tool"
				  >
					<Icon icon="material-symbols:settings-applications-outline" width="24" height="24"  style={{color: 'white'}} />				  </button>
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_delete btn_tool"
				  >
					<i className="fa-solid fa-trash"></i>
				  </button>
				</div>
			  ),
		  },
		  {
			id: 'contourModesPopup',
			mini: false,
			fa: (<Icon icon="mynaui:square-dashed-solid" width="24" height="24"  style={{color: 'white'}} />),
			style: {
			  top: 121,
			  left: 12,
			  width: 350,
			  height: 'auto',
			  zIndex: 122,
			},
			content: (
			  <div className="window-content">
				<div className="d-flex">
				  <table className="table">
					<thead className="table-dark">
					  <tr>
						<th colSpan="2">Режимы работы</th>
					  </tr>
					</thead>
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
	</>
);
};

export default Panels;
