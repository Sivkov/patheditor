import { Icon } from '@iconify/react';
import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';  
import svgStore from "../stores/svgStore.js";
import editorStore from "../stores/editorStore.js";
import inlet from './../../scripts/inlet.js'
import ShapeModalComponent from '../shapeModalComponent.js';
import { addToLog } from '../../scripts/addToLog.js';
import util from '../../utils/util.js';
import { showToast } from '../toast.js';
import TooltipCreator from './tooltipCreator.js';
import { useTranslation } from 'react-i18next';


const ToolsPanel = observer(() => {
	const { t } = useTranslation();
	const deleteContour =()=>{
		if  (svgStore.getSelectedElement()){
			svgStore.deleteSelected()
			showToast({
				type: 'success',
				message: 'Contour was deleted!',				
				autoClose: 5000,
				theme: 'dark',
			});

			addToLog('Contour deleted')
		}
	}

	const setMode =(mode)=>{
		editorStore.setMode(mode)
		svgStore.setSelectedPointOnEdge(false)
		svgStore.setSelectedPointOnPath(false)
		svgStore.setContourSelected(false)
		svgStore.setSelectedEdge(false)
		svgStore.setTextFocus(false)
		svgStore.setLaserShow ({on:false, speed:svgStore.laserShow.speed})
	}

	const copyContour =()=>{
		//console.log  ( svgStore.selectedCid )
		if  ( svgStore.selectedCid !== -1){
			showToast({
				type: 'success',
				message: 'Contour was copied to buffer!',			
				autoClose: 5000,
				theme: 'dark',
			});
	
			if (typeof svgStore.selectedCid === 'number') {
				svgStore.setCopiedCid ( svgStore.selectedCid )
			}		
		} else {

			showToast({
				type: 'error',
				message: 'Contour not selected!',			
				autoClose: 5000,
				theme: 'dark',
			});

		}
	}

	const pasteContour =()=>{
		if (typeof svgStore.copiedCid !== 'number') {
			showToast({
				type: 'warning',
				message: 'Contour not copied!',
				
				autoClose: 5000,
				theme: 'dark',
			});
			return
		}
		svgStore.addElementWithCid ( svgStore.copiedCid )
		svgStore.setCopiedCid ( false )
		showToast({
			type: 'success',
			message: 'Contour was paste from buffer!',			
			autoClose: 5000,
			theme: 'dark',
		});
		addToLog("Contour pasted")
	}

	const reverse =()=>{
		inlet.reversePath ()
	}

	const addPointToPath =()=>{
		let newPathData = util.addPointToPath()
		if (newPathData) {
			svgStore.updateElementValue(svgStore.selectedPointOnPath.cid, 'contour', 'path', newPathData) 
			svgStore.setSelectedPointOnPath(false)
			addToLog('Added new point to path') 
		}		
	}

	const deletePoint =()=>{
		let newPathData = util.deletePoint()
		if (newPathData) {
			svgStore.updateElementValue(svgStore.selectedPointOnEdge.cid, 'contour', 'path', newPathData) 
			svgStore.setSelectedPointOnEdge(false)
			addToLog('Point deleted from path') 
		} else {
			//console.log ('No cut signor!')
			showToast({
				type: 'warning',
				message: 'Point delete from path is impossible',				
				autoClose: 5000,
				theme: 'dark',
			  });
		}
	}

	const roundEdge =()=>{
		let newPathData = util.createFilletArc()
		if (newPathData) {
			svgStore.updateElementValue(svgStore.selectedPointOnEdge.cid, 'contour', 'path', newPathData) 
			svgStore.setSelectedPointOnEdge(false)
			addToLog('Edge rounded') 
		} else {
			//console.log ('No cut signor!')
			showToast({
				type: 'warning',
				message: 'It is impossible to round this edge',
				
				autoClose: 5000,
				theme: 'dark',
			  });
		}
	}

	const panelInfo = [
		{
			id: "toolsPopup",
			fa: (<Icon icon="heroicons:wrench-screwdriver-20-solid" />),
 			content: (
				<div className="d-flex align-items-center btn_block flex-wrap">
				  	<TooltipCreator
						element={{
							id: 'resizeMode',
							info: (
								<button
									id="btn_resize_mode"
									type="button"
									className="btn text-white mt-1 ms-2 btn_tool d-flex align-items-center"
									onMouseDown={() => setMode('resize')}
									aria-label={t('Resize Mode')} // Улучшаем доступность
								>
									<i className="fa-solid fa-arrow-pointer" style={{ marginRight: '5px' }}></i>
								</button>
							)
						}}
					/>
					<TooltipCreator
						element={{
							id: 'dragMode',
							info: (
								<button
									type="button"
									id="dragMode"
									className="btn text-white mt-1 ms-2 btn_tool d-flex align-items-center"
									onMouseDown={() => setMode('drag')}
									aria-label={t('Drag Mode')} // Улучшаем доступность
								>
									<i className="fa-solid fa-hand" style={{ marginRight: '5px' }}></i>
								</button>
							)
						}}
					/>
				 
					{svgStore.selectedPointOnPath ? 
						<TooltipCreator
						element={{
							id: 'addPointToPath',
							info: (
								<button
									id="addPointToPath"
									type="button"
									className="btn text-white mt-1 ms-2 btn_mode d-flex align-items-center btn_tool btn_add_point"
									onMouseDown={addPointToPath}
									aria-label={t('Add Point to Path')} 
								>
									<Icon icon="gridicons:add" width="24" height="24" style={{ marginRight: '5px' }} />
 								</button>
							)
						}}
					/>
						:

						<TooltipCreator
							element={{
								id: 'addPoint',
								info: (
									<button
										id="addPoint"
										type="button"
										className="btn text-white mt-1 ms-2 btn_mode d-flex btn_tool btn_add_point"
										onMouseDown={() => setMode('addPoint')}
										aria-label={t('Add Point')}>
										<div className="d-flex flex-row align-items-center justify-content-center">
											<i className="fa-solid fa-arrow-pointer" style={{ marginRight: '5px' }}></i>
											<div style={{ marginTop: 11 }}>+</div>
										</div>
									</button>
								)
							}}
						/>						
					}					
					
					<TooltipCreator
						element={{
							id: 'rounding',
							info: (
								<button
									id='rounding'
									type="button"
									className="btn text-white mt-1 ms-2 btn_rounding btn_tool"
									onMouseDown={roundEdge}
									aria-label="Округление углов" // Добавляем атрибут для доступности
								>
									<Icon icon="proicons:arc" width="24" height="24" style={{ color: 'white' }} />
									{/* Можно добавить текстовое обозначение, если это улучшит понимание функции */}
								</button>
							),
						}}
					/>
					{ svgStore.selectedPointOnEdge ?

						<TooltipCreator
							element={{
								id: 'deletePoint',
								info: (
									<button
										type="button"
										className="btn text-white mt-1 ms-2 btn_tool btn_selectPoint_mode"
										onMouseDown={deletePoint}
										aria-label="Удалить точку" // Улучшаем доступность
									>
										<Icon icon="gridicons:cross-circle" width="24" height="24" />
 									</button>
								),
							}}
						/>				
						:
						<TooltipCreator
							element={{
								id: 'selectPoint',
								info: (
									<button
										type="button"
										id="selectPoint"
										className="btn text-white mt-1 ms-2 btn_tool btn_selectPoint_mode"
										onMouseDown={() => setMode('selectPoint')}
										aria-label="Выбор точки" // Улучшаем доступность
									>
										<Icon icon="mage:mouse-pointer" width="24" height="24" style={{ color: 'white' }} />
 									</button>
								),
							}}
						/>
					}
					<TooltipCreator
						element={{
							id: 'btn_copy',
							info: (
								<button
									type="button"
									id="btn_copy"
									className="btn text-white mt-1 ms-2 btn_copy btn_tool" 
									onMouseDown={copyContour}
									aria-label="Копировать контур" // Делаем кнопку более доступной
								>
									<i className="fa-solid fa-copy"></i>
 								</button>
							),
						}}
					/>
					<TooltipCreator
						element={{
							id: 'btn_paste',
							info: (
								<button
									id='pasteContour'
									type="button"
									className="btn text-white mt-1 ms-2 btn_paste btn_tool" 
									onMouseDown={pasteContour}
									aria-label="Вставить контур" // Улучшаем доступность с aria-label
								>
									<i className="fa-solid fa-file-import"></i>
 								</button>
							),
						}}
					/>
					<TooltipCreator
						element={{
							id: 'btn_reverse',
							info: (
								<button
									id="reverse"
									type="button"
									className="btn text-white mt-1 ms-2 btn_reverse_path btn_tool"
									onMouseDown={reverse}
									aria-label="Обратить путь" // Атрибут для доступности
								>
									<i className="fa-solid fa-rotate"></i>
								</button>
							),
						}}
					/>
  					<ShapeModalComponent />
				   <TooltipCreator
						element={{
							id: 'btn_text',
							info: (
								<button
									type="button"
									className="btn text-white mt-1 ms-2 btn_text btn_tool"
									onMouseDown={() => setMode('text')}
									aria-label="Выбрать текстовый режим" // Атрибут для доступности
								>
									<Icon icon="tabler:text-size" width="24" height="24" />
									{/* Если хотите добавить текст рядом с иконкой, может выглядеть так: */}
									{/* Текст */}
								</button>
							),
						}}
					/>
				<TooltipCreator
					element={{
						id: 'btn_new_outer',
						info: (
							<button
								id="btn_new_outer"
								type="button"
								className="btn text-white mt-1 ms-2 btn_new_outer btn_tool"
								onClick={() => svgStore.setNewOuter()}
								aria-label="Создать новый внешний элемент" // Атрибут для доступности
							>
								<Icon icon="material-symbols:settings-applications-outline" width="24" height="24" style={{ color: 'white' }} />
								{/* Можно добавлять текст рядом с иконкой, если это необходимо */}
								{/* Создать новый */}
							</button>
						),
					}}
				/>
				<TooltipCreator
					element={{
						id: 'btn_delete',
						info: (
							<button
								type="button"
								id="btn_delete"
								className="btn text-white mt-1 ms-2 btn_delete btn_tool" 
								onMouseDown={deleteContour}
								aria-label="Удалить контур" // Улучшаем доступность с aria-label
							>
								<i className="fa-solid fa-trash"></i>
								{/* Опционально можно добавить текстовое обозначение, если это необходимо */}
							</button>
						),
					}}
				/>
				</div>
			  ),
		  },   
	]

return (
	<>
		{panelInfo.map((element, index) => (
			<Panel key={'panel' + index+8} element={element}/>
		))}
	</>
	);
})

export default ToolsPanel; 