import { Icon } from '@iconify/react';
import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';
import svgStore from "../stores/svgStore.js";
import { useEffect, useState, useRef } from 'react';
import SVGPathCommander from 'svg-path-commander';
import Util from '../../utils/util.js';
//import { toJS } from "mobx";
import inlet from '../../scripts/inlet.js';
import { addToLog } from './../../scripts/addToLog.js';

const ContourPanel = observer(() => {

	const { 
			selected,
			selectedPath,
			selectedType,
			selectedCid,
			selectedContourModeType, 
		   	selectedInletModeType,
			selectedPiercingType } = svgStore;

	const setSelectedContourModeType =(e)=> {
		let n = (Number(e.target.value))
		let newMode = 'macro'+n
		let selected = svgStore.getSelectedElement()
		let oldMode = selected.class.split(' ').filter(a => a.startsWith('macro')).join('')
		if (selected) {
			let newClass =  selected.class.replace(/macro\d/gm, '')+' '+newMode
			if (newMode === 'macro2') {
				newClass+=' engraving'
				svgStore.removeElementByCidAndClass(selectedCid, 'inlet')
				svgStore.removeElementByCidAndClass(selectedCid, 'outlet')
			}
			if (oldMode === 'macro2' && oldMode !== newMode) {
				newClass = newClass.replace('engraving', 'inner')
				let inlet={
					cid:selectedCid,
					class:"inlet inner macro0 closed1",
					path: '',
					stroke:'red',
					strokeWidth:0.2,
				}

				let outlet={
					cid:selectedCid,
					class:"outlet inner macro0 closed1",
					path:'',
					stroke:'lime',
					strokeWidth:0.2,
				};
				svgStore.addElement(inlet)
				svgStore.addElement(outlet)
			}
			svgStore.updateElementValue(selected.cid, 'contour', 'class', newClass)
			addToLog ('Contour type changed')
		}		
	}

	const setSelectedInletModeType =(e)=> {
		let n = (Number(e.target.value))
		let newMode = 'macro'+n
		let selected = svgStore.getSelectedElement()
		if (selected) {
			let inlet = svgStore.getElementByCidAndClass(selected.cid, 'inlet')
			let newClass =  inlet.class.replace(/macro\d/gm, '')+' '+newMode
			svgStore.updateElementValue(selected.cid, 'inlet', 'class', newClass)
			addToLog ('Inlet type changed')

		}
	}

	const setSelectedPiercingType =(e)=>{
		let n = (Number(e.target.value))
		let newMode = 'pulse'+n
		let selected = svgStore.getSelectedElement()
		if (selected) {
			let inlet = svgStore.getElementByCidAndClass(selected.cid, 'inlet')
			let newClass =  inlet.class.replace(/pulse-1/gm, '').replace(/pulse\d/gm, '')+' '+newMode
			svgStore.updateElementValue(selected.cid, 'inlet', 'class', newClass)
			addToLog ('Piercing type changed')
		}

	}

	const [activePoint, setActive] = useState('topYtopX')
	const [activeCooord, setActiveCoord ] = useState({x:0,y:0})
	const [wh, setWH ] = useState({w:0,h:0})
	const [angle, setAngle ] = useState(0)
	const cellRef = useRef(null); // Ссылка на ячейку таблицы


	const contourPoint =(e) =>{
		let id  = e.currentTarget.getAttribute('id')
		setActive(id)
	}


	useEffect(()=>{
		//console.log ('USING EFFECT')
		updateState()
 	},[ selected, selectedPath, activePoint])

	const updateState = () => {

		let x = 0
		let y = 0

		if (angle === 0) {
			setAngle('')
		} else {
			setAngle(0)
		}

		
		let  path = svgStore.getSelectedElement('path') 
		if (!path) {
			setActiveCoord({x,y})
			setWH({w:x,h:y})
 			return	
		}

		const box = SVGPathCommander.getPathBBox(path);
		if (box) {
			let w = Util.round(box.width, 3)
			let h= Util.round(box.height, 3)
			setWH({w,h})

		}

		if (activePoint.match(/topX/gm)) {
			x=box.x
		} else if (activePoint.match(/midX/gm)) {
			x=box.x + box.width*0.5
		} else if (activePoint.match(/botX/gm)) {
			x=box.x2
		}

		if (activePoint.match(/topY/gm)) {
			y=box.y
		} else if (activePoint.match(/midY/gm)) {
			y=box.y + box.height*0.5
		} else if (activePoint.match(/botY/gm)) {
			y=box.y2
		}

		if(activeCooord) setActiveCoord({x:Util.round(x, 3),y:Util.round(y, 3)})	
	}

	const captureInput = (event) => {
	 	// Get the current value from the event
		const newValue = event.currentTarget.textContent.trim();
		// Update the angle state, assuming the input should be a number
		if (!isNaN(newValue) && newValue !== '') {
		  setAngle(Number(newValue)); // Convert string to number
		} else {
		  // Handle invalid input if necessary
		  console.warn('Invalid input, please enter a number');	
		  if (angle === 0) {
			setAngle('')
		  } else {
			setAngle(0)
		  }
		}
		const range = document.createRange();
		const selection = window.getSelection();
		
		// Устанавливаем диапазон в конец ячейки
		range.selectNodeContents(cellRef.current);
		range.collapse(false); // Сжимаем диапазон к концу
		selection.removeAllRanges(); // Убираем все выделения
		selection.addRange(range); // Добавляем новый диапазон 
	  };

	const onKeyDown =(e)=> {
		let id = e.currentTarget.getAttribute('id')
		let val = Number(e.currentTarget.textContent)
		let path = svgStore.getSelectedElement('path') 
		let cid =  svgStore.getSelectedElement('cid') 
		//TODO нижнюю строку убрать и далее при вращении относительно любой точке
		// кроме центра необходимо учитывать смещение относительно высоты ширины
		 
		if(id === 'contourRotateValue') setActive('midXmidY');

		if( !path ) return;
		let params = {
			x:activeCooord.x,
			y:activeCooord.y,
			width:wh.w,
			height:wh.h,
			angle: angle,
			proportion: false//proportion
		}
		if (e.key === 'Enter' || e.key === 'Return' || e.key === 'Tab') {
			
			if (e.key === 'Enter') e.preventDefault();			
			let newPath = Util.transformContour(path, id, val, params)
			newPath = SVGPathCommander.normalizePath( newPath ).toString().replaceAll(',', ' ')
			if(id === 'contourRotateValue') {
				let res = inlet.getNewInletOutlet(cid, 'contour', 'path', newPath, {angle: angle, x:activeCooord.x, y:activeCooord.y} )
				inlet.applyNewPaths( res )			
			} else {
				let res = inlet.getNewInletOutlet(cid, 'contour', 'path', newPath )
				inlet.applyNewPaths( res )			
			};
		}	
	}

	const alignItems =(direction)=> {
		console.log (direction)
		let newPath, xDif=0, yDif=0;
		let path = svgStore.getSelectedElement('path') 
		let cid =  svgStore.getSelectedElement('cid') 
		let classes = svgStore.getElementByCidAndClass ( cid, 'contour', 'class')
		let outerPath = svgStore.getOuterElement('path')
		let outerPathParams = SVGPathCommander.getPathBBox(outerPath)
		let innerPathParams = SVGPathCommander.getPathBBox(path)
		if ( classes.includes('outer')) {
			return;
		}
		if (direction === 'left' ) {
			xDif = outerPathParams.x - innerPathParams.x
		} else if (direction === 'right' ) {
			xDif = outerPathParams.x2 - innerPathParams.x2
		} else if (direction === 'center-horizontal') {
			yDif = outerPathParams.cy - innerPathParams.cy
		} else if (direction === 'top') {
			yDif = outerPathParams.y - innerPathParams.y
		} else if (direction === 'center-vertical') {
			xDif = outerPathParams.cx - innerPathParams.cx			
		} else if (direction === 'bottom') {
			yDif = outerPathParams.y2 - innerPathParams.y2
		} 
		console.log (xDif, yDif)
		newPath = Util.applyTransform(path, 1, 1, xDif, yDif, {angle: angle, x:0, y:0})
		let resp = inlet.getNewInletOutlet(cid, 'contour', 'path', newPath )
		inlet.applyNewPaths ( resp )

	} 

	const panelInfo = [
		{
			id: "contourPopup",
			fa: (<><Icon icon="oui:polygon" width="24" height="24" style={{ color: 'white' }} className='me-2' /><div>Contour</div></>),
			content: (<div className="d-flex flex-column">
			<table className="table mb-0">
			  <tbody>
				<tr>
				  <td colSpan={2} className="text-start ps-2">
					Type:
				  </td>
				  <td colSpan={2}><div id="info_type">{selectedType}</div></td>
				  </tr>
				<tr style={{ height: "1.5rem" }}>
				  <td colSpan={2} className="text-start ps-2">
					Piercing:
				  </td>
				  <td colSpan={2} style={{ padding: "0 0.2rem" }} id="info_piercing_mode">
					<select
						className="form-select"
						id="piercingSelect"
						aria-label="Default select example"
						onChange={ setSelectedPiercingType }
						value={selectedPiercingType}
						>
 							<option value={-1} disabled={typeof selectedPiercingType  === 'number'}>
								-- Select Piercing Type --
							</option>	
							<option value={0}>normal</option>
							<option value={1}>pulse</option>
							<option value={2}>without_time</option>
						</select>
				  </td>
				</tr>
				<tr style={{ height: "1.5rem" }}>
				  <td colSpan={2} className="text-start ps-2">
					Inlet:
				  </td>
				  <td
					colSpan={2}
					style={{ padding: "0 0.2rem" }}
					id="info_inlet_operating_mode"
				  >
					 <select
                        id="operatingInletSelect"
                        className="form-select"
                        aria-label="Default select example"
						value={selectedInletModeType}
						onChange={ setSelectedInletModeType }
                        >
							<option value={-1} disabled={selectedInletModeType}>
								-- Select Inlet Mode --
							</option>							
							<option value={0} >cutting</option>
							<option value={1} >pulse</option>
							<option value={2} >engraving</option>
							<option value={3} >macro3</option>
							<option value={4} >macro4</option>
							<option value={5} >cutless</option>
                        </select> 				  
					</td>
				</tr>
				<tr style={{ height: "1.5rem" }}>
				  <td colSpan={2} className="text-start ps-2">
					Contour:
				  </td>
				  <td
					colSpan={2}
					style={{ padding: "0 0.2rem" }}
					id="info_contour_operating_mode"
				  ><div></div>
					 
					  <select
                        id="operatingContourModeSelect"
                        className="form-select"
                        aria-label="Default select example"
						value={selectedContourModeType} // Привязка состояния
						onChange={ setSelectedContourModeType }
                        >
							<option value={-1} disabled={selectedContourModeType}>
								-- Select Contour Mode --
							</option>								
							<option value={0} >cutting</option>
							<option value={1} >pulse</option>
							<option value={2} >engraving</option>
							<option value={3} >macro3</option>
							<option value={4} >macro4</option>
							<option value={5} >cutless</option>
                        </select> 
				  </td>
				</tr>
			  </tbody>
			</table>
			<table className="table mb-0">
			  <thead className="table-dark">
				<tr>
				  <th colSpan={5}>Transformations</th>
				</tr>
			  </thead>
			  <tbody>
				<tr>
				  <td className="w-25" rowSpan={3}>
					<div
					  style={{
						width: "initial",
						height: "5rem",
						display: "flex",
						justifyContent: "center",
						alignItems: "center"
					  }}
					>
					  <div
						style={{
						  display: "flex",
						  alignItems: "center",
						  justifyContent: "center",
						  height: "2.5rem"
						}}
					  >
					<div className="containerPoint">
						<div
							id="topYtopX"
							onMouseDown={contourPoint}
							className={`contourPoint topY topX ${activePoint === 'topYtopX' ? 'active' : ''}`}
						/>
						<div
							id="topYbotX"
							onMouseDown={contourPoint}
							className={`contourPoint topY botX ${activePoint === 'topYbotX' ? 'active' : ''}`}
						/>
												<div
							id="botYtopX"
							onMouseDown={contourPoint}
							className={`contourPoint botY topX ${activePoint === 'botYtopX' ? 'active' : ''}`}
						/>
						<div
							id="botYbotX"
							onMouseDown={contourPoint}
							className={`contourPoint botY botX ${activePoint === 'botYbotX' ? 'active' : ''}`}
						/>
						<div
							id="midXtopY"
							onMouseDown={contourPoint}
							className={`contourPoint midX topY ${activePoint === 'midXtopY' ? 'active' : ''}`}
						/>
						<div
							id="midXbotY"
							onMouseDown={contourPoint}
							className={`contourPoint midX botY ${activePoint === 'midXbotY' ? 'active' : ''}`}
						/>
												<div
							id="midYtopX"
							onMouseDown={contourPoint}
							className={`contourPoint midY topX ${activePoint === 'midYtopX' ? 'active' : ''}`}
						/>
						<div
							id="midYbotX"
							onMouseDown={contourPoint}
							className={`contourPoint midY botX ${activePoint === 'midYbotX' ? 'active' : ''}`}
						/>
												<div
							id="midXmidY"
							onMouseDown={contourPoint}
							className={`contourPoint midX midY ${activePoint === 'midXmidY' ? 'active' : ''}`}
						/>
 					  </div>
					  </div>
					</div>
				  </td>
				  <td>X:</td>
				  <td id="contourPointXvalue" 
				  className="editable" 
				  contentEditable=""
				  onKeyDown={onKeyDown}		
				  >
					{activeCooord.x}
				  </td>
				  <td>Y:</td>
				  <td id="contourPointYvalue" 
				  className="editable" 
				  contentEditable=""
				  onKeyDown={onKeyDown}		
				  >
				  {activeCooord.y}
				  </td>
				</tr>
				<tr>
				  <td>__:</td>
				  <td id="contourWidthValue" 
				  className="editable" 
				  contentEditable=""
				  onKeyDown={onKeyDown}		
				  >
					{wh.w}
				  </td>
				  <td>|:</td>
				  <td id="contourHeightValue" 
				  	className="editable" 
					contentEditable=""
					onKeyDown={onKeyDown}		
					>
					{wh.h}
				  </td>
				</tr>
				<tr>
				  <td>
					<i className="fa-solid fa-link" />
				  </td>
				  <td>
					<div className="d-flex align-items-center">
					  <div>W</div>
					  <input
						className="mx-2 text-center"
						id="proportionX"
						type="number"
						placeholder={100}
						min={0}
						max={100}
						step={1}
						defaultValue={100}
						disabled=""
					  />
					  <div>%</div>
					</div>
				  </td>
				  <td>
					<input id="proportion" type="checkbox" />
				  </td>
				  <td>
					<div className="d-flex align-items-center">
					  <div>H</div>
					  <input
						className="mx-2 text-center"
						id="proportionY"
						type="number"
						placeholder={100}
						min={0}
						max={100}
						step={1}
						defaultValue={100}
						disabled=""
					  />
					  <div>%</div>
					</div>
				  </td>
				</tr>
				<tr>
				  <td className="w-25" rowSpan={3}></td>
				  <td>
					<div className="d-flex flex-row align-items-top justify-content-center">
					<Icon icon="tabler:angle" width="24" height="24" />					  <div
						style={{ fontFamily: '"Font Awesome 6 Pro"', marginTop: "-7px" }}
					  >
						°
					  </div>
					</div>
				  </td>
				  <td 
				  	ref={cellRef}
					id="contourRotateValue" 
					className="editable" 
					contentEditable=""
					onKeyDown={onKeyDown}	
					onInput={captureInput} 
					>
					{ angle }
				  </td>
				  <td />
				  <td />
				</tr>
				<tr>
				  <td>
					<i className="fa-solid fa-rectangles-mixed" />
				  </td>
				  <td colSpan={4}>
					<input id="transformAll" type="checkbox" defaultChecked="" />
					outer &amp; inner
				  </td>
				</tr>
			  </tbody>
			</table>
			<table className="table">
			  <thead className="table-dark">
				<tr>
				  <th colSpan={5}>Align</th>
				</tr>
			  </thead>
			  <tbody>
				<tr>
				  <td>
					<div className="d-flex align-items-center justify-content-around">
						<button
							type="button"
							onMouseDown={() => alignItems('left')}
							className="btn text-white mt-1 btn_align btn_align-left"
 						>
							<Icon icon="solar:align-left-linear" width="28" height="28" />
						</button>
						<button
							type="button"
							onMouseDown={() => alignItems('center-vertical')}
							className="btn text-white mt-1 btn_align btn_align-center-vertical"
 						>
							<Icon icon="solar:align-horizontal-center-linear" width="28" height="28" />
						</button>
						<button
							type="button"
							onMouseDown={() => alignItems('right')}
							className="btn text-white mt-1 btn_align btn_align-right"
 						>
							<Icon icon="solar:align-right-linear" width="28" height="28" />
						</button>
						<button
							type="button"
							onMouseDown={() => alignItems('top')}
							className="btn text-white mt-1 btn_align btn_align-top"
 						>
							<Icon icon="solar:align-top-linear" width="28" height="28" />
						</button>
						<button
							type="button"
							onMouseDown={() => alignItems('center-horizontal')}
							className="btn text-white mt-1 btn_align btn_align-center-horizontal"
 						>
							<Icon icon="solar:align-vertical-center-linear" width="28" height="28" />
						</button>
						<button
							type="button"
							onMouseDown={() => alignItems('bottom')}
							className="btn text-white mt-1 btn_align btn_align-bottom"
 						>
							<Icon icon="solar:align-bottom-linear" width="28" height="28" />
					  	</button>
					</div>
				  </td>
				</tr>
			  </tbody>
			</table>
			<table className="table">
			  <thead className="table-dark">
				<tr>
				  <th colSpan={5}>Rounding</th>
				</tr>
			  </thead>
			  <tbody>
				<tr>
				  <td className="text-start ps-2">
					<div className="d-flex align-items-center justify-content-around">
					  <div className="d-flex align-items-center">
					  	<Icon icon="ant-design:radius-upright-outlined" width="24" height="24" />
						<div className="ms-2">Rounding radius</div>
						<input
						  className="mx-2"
						  id="rounding_radius"
						  type="number"
						  placeholder={1}
						  min={0}
						  max={10000}
						  step={1}
						  defaultValue={5}
						/>
						<div>mm</div>
					  </div>
					</div>
				  </td>
				</tr>
			  </tbody>
			</table>
		  </div>
		),
	},   
]

return (
	<>
		{panelInfo.map((element, index) => (
			<Panel key={'panel' + index + 1} element={element} index={index + 1} />
		))}
	</>
);
})

export default ContourPanel; 