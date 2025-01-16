import { Icon } from '@iconify/react';
import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';  
import logStore from '../stores/logStore.js'; 
import svgStore from "../stores/svgStore.js";
import editorStore from "../stores/editorStore.js";
import log from './../../scripts/log.js'
 

const ToolsPanel = observer(() => {
	const deleteContour =()=>{
		if  (svgStore.getSelectedElement()){
			svgStore.deleteSelected()
			let now = new Date().getTime()
			logStore.add ({time: now ,action:'Contour deleted'})
			let data = {
				id: now,
				svg: JSON.stringify(svgStore.svgData)
			}
			log.save(data)		
		}
	}

	const setResize =()=>{
		editorStore.setMode('resize')
	}

	const setDrag =()=>{
		editorStore.setMode('drag')
	}

	const panelInfo = [
		{
			id: "toolsPopup",
			fa: (<Icon icon="heroicons:wrench-screwdriver-20-solid" />),
 			content: (
				<div className="d-flex align-items-center btn_block flex-wrap">
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_tool btn_resize_mode"
					onMouseDown={setResize}
				  >
					<i className="fa-solid fa-arrow-pointer"></i>
				  </button>
				  <button
					type="button"
					className="btn text-white mt-1 ms-2 btn_tool btn_drag_mode"
					onMouseDown={setDrag}
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
					className="btn text-white mt-1 ms-2 btn_delete btn_tool" onMouseDown={deleteContour}
				  >
					<i className="fa-solid fa-trash"></i>
				  </button>
				</div>
			  ),
		  },   
	]

return (
	<>
		{panelInfo.map((element, index) => (
			<Panel key={'panel' + index+8} element={element} index={index+8} />
		))}
	</>
	);
})

export default ToolsPanel; 