import Panel from './panel.js';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import util from '../../utils/util.js';
import { useTranslation } from 'react-i18next';
import { addToLog } from '../../scripts/addToLog.js';
import svgStore from '../stores/svgStore.js';
import { Icon } from '@iconify/react';
import { ReactSortable } from "react-sortablejs";



const CutPanel = observer(() => {

	const { t } = useTranslation();
	const [speed,setSpeed] = useState(50)
	const runCutQue = () => {
		svgStore.setLaserShow ( {on:true, speed:speed} )
	}
	const stopCutQue = () => { 
		svgStore.setLaserShow ({on:false, speed:speed})
	}
	
	const setShowSpeed =(e)=>{
		let val = +e.currentTarget.value
		svgStore.setLaserShow ( {on: svgStore.laserShow.on, speed:val})
		setSpeed (val)
	}

	
	const [WH, setWH] = useState({w:50, h:50})
	const [miniSvg, setMiniSvg] = useState({sizeX:25, sizeY:25})

	const inners = svgStore.getFiltered(["inner",    "contour"])
	const engs  =  svgStore.getFiltered(["engraving","contour"])
	

	const createCenteredSVGPath = (element, index) => {
		//console.log ('createCenteredSVGPath '+ element.cid)
		//if (!element || !element.path) return null;
	  
		let { path, cid, class: className } = element;
		const classList = className || "";
		const contour = classList.includes("inner") ? "inner" : "outer";
		const cutlessElement = classList.includes("macro5");
		if (path.length === 0) path = 'M0 0'
	  
		const bbox = util.fakeBox(path);
		if (!bbox) {
		  //console.error("Failed to calculate bounding box");
		  return null;
		}
	  
		const { x, y, width, height } = bbox;
	  
		const scaleX = miniSvg.sizeX / width;
		const scaleY = miniSvg.sizeY / height;
		const scale = Math.min(scaleX, scaleY);
	  
		const translateX = (miniSvg.sizeX - width * scale) / 2 - x * scale;
		const translateY = (miniSvg.sizeY - height * scale) / 2 - y * scale;
	  
		return (
		  <div
			className={`grid-square ${cutlessElement ? "macro5" : ""}`}
			data-cid={cid}
			style={{
			  width: `${WH?.w ?? 100}px`,
			  height: `${WH?.h ?? 100}px`,
			}}
			onMouseOver = {mouseOver}
			onMouseLeave = {mouseLeave}
			key={cid}

		  >
			<svg
			  width={miniSvg.sizeX}
			  height={miniSvg.sizeY}
			  fill={contour === "inner" ? "#fd7e14" : "none"}
			  stroke={contour === "inner" ? "none" : "#fd7e14"}
			  strokeWidth={contour === "inner" ? "0" : "1"}
			>
			  <path d={path} transform={`translate(${translateX}, ${translateY}) scale(${scale})`} />
			</svg>
		  </div>
		);
	};
	  

	const resizeCutItem =(event)=> {
		//console.log ('resizeCutItem')
		let e = event.currentTarget;
		var newValueX, newValueY, svgX, svgY;
		if (e.classList.contains('w50')){
			newValueX = 50 
			newValueY = 50
			svgX=25 
			svgY=25;
		} else if (e.classList.contains('w100')) {
			newValueX = 100 
			newValueY = 100
			svgX=50
			svgY=50;
		} else {
			newValueX = (JSON.parse(localStorage.getItem('ppp'))?.cutPopup?.style?.width||500)-50
			newValueY =100
			svgX = newValueX
			svgY = 100
		}
        setWH({w:newValueX,h:newValueY})
		setMiniSvg({sizeX:svgX,sizeY:svgY})
	}

	const mouseOver =(e)=>{
		let target = e.currentTarget
		let cid = +target.getAttribute("data-cid")
		svgStore.setHighLighted(cid)
	}

	const mouseLeave =(e)=>{
		svgStore.setHighLighted( false )
	}

	const setList =(e) =>{
		if (e.length && inners.length) {
			svgStore.reorderItems (e, inners)		
			addToLog("Cut order was changed")
		}
		
	}

	const setListEngs =(e) =>{
		if (e.length && engs.length) {
			svgStore.reorderItems (e, engs)
			addToLog("Cut order was changed")	
		}	
	}

	const panelInfo =
	{
		id: 'cutPopup',
		fa: (<><i className="fa-solid fa-route me-2" /><div>{t('Cutting order')}</div></>),
		content: (
			<div className="d-flex flex-column">
				<table className="table">
					<tbody>
						<tr>
							<td>
								<div className="d-flex align-items-center justify-content-evenly">
									<div className="ms-2 w-25">
										<input
										type="range"
										className="form-range"
										id="speedPartShow"
										step={1}
										min={1}
										max={100}
										value={speed}
										onChange={ setShowSpeed }
										/>
									</div>
									<div className="ms-2">
										<button
											type="button"
											className="btn btn-sm btn-info"
											id="playCutPartOrder"
											onMouseDown={runCutQue}
										>
											<Icon icon="material-symbols:play-arrow-rounded" width="24" height="24" style={{ color: "white" }} />
										</button>
										<button
											type="button"
											className="btn btn-sm btn-danger ms-1"
											id="stopCutQue"
											onMouseDown={stopCutQue}
										>
											<Icon icon="material-symbols:stop-rounded" width="24" height="24" style={{ color: "white" }} />
										</button>
									</div>
									<div className="ms-2">
										<button
											type="button"
											className="btn btn-sm btn-primary w50 resizeCutItem"
											onMouseDown={resizeCutItem}
										>
											<Icon icon="material-symbols:grid-on-sharp" width="24" height="24" style={{ color: "white" }} />
										</button>
										<button
											type="button"
											className="btn btn-sm btn-primary w100 resizeCutItem"
											onMouseDown={resizeCutItem}
										>
											<Icon icon="material-symbols-light:grid-view" width="24" height="24" style={{ color: "white" }} />
										</button>
										<button
											type="button"
											className="btn btn-sm btn-primary resizeCutItem"
											onMouseDown={resizeCutItem}
										>
											<Icon icon="material-symbols-light:format-list-bulleted-rounded" width="24" height="24" />
										</button>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div className="d-flex flex-column" id="editCutPartSquare" />
							</td>
						</tr>
						<tr>
							<td>
								<div className="d-flex flex-column" id="cutPartModel" />
								<div className="">
									<nav>
										<div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
											<button
												className="nav-link "
												id="nav-engraving-tab"
												data-bs-toggle="tab"
												data-bs-target="#nav-engraving"
												type="button"
												role="tab"
												aria-controls="nav-engraving"
												aria-selected="false"
												tabIndex={-1}
											>
												{t('Engraving')}
											</button>
											<button
												className="nav-link active"
												id="nav-inner-tab"
												data-bs-toggle="tab"
												data-bs-target="#nav-inner"
												type="button"
												role="tab"
												aria-controls="nav-inner"
												aria-selected="false"
												tabIndex={-1}
											>
												{t('Inner')}
											</button>
										</div>
									</nav>
									<div className="tab-content p-3" id="nav-tabContent">
										<div
											className="tab-pane fade"
											id="nav-engraving"
											role="tabpanel"
											aria-labelledby="nav-engraving-tab"
										>
											<div className="gridWrapper">
												<div id="engravingSort">
												<ReactSortable
													dragClass="sortableDrag"
													filter=".addImageButtonContainer"
													list={engs}
													setList={setListEngs}
													animation={75}
													easing="ease-out"
													className='d-flex flex-row flex-wrap'
													>
													{engs.map((item, index) => (

														createCenteredSVGPath(item, index)
														
													))}
												</ReactSortable>
											 	
												</div>
											</div>
										</div>
										<div
											className="tab-pane active show "
											id="nav-inner"
											role="tabpanel"
											aria-labelledby="nav-inner-tab"
										>
											<div className="gridWrapper">
												<div id="innerSort">
												<ReactSortable
													dragClass="sortableDrag"
													filter=".addImageButtonContainer"
													list={inners}
													setList={setList}
													animation={75}
													easing="ease-out"
													className='d-flex flex-row flex-wrap'
													>
													{inners.map((item, index) => (
														
														createCenteredSVGPath(item, index)
														
													))}
												</ReactSortable>

	 											</div> 
											</div>
										</div>
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>)
	}

	return (
		<>
			<Panel key={'panel' + 14} element={panelInfo} index={14} />
		</>
	);
})

export default CutPanel;