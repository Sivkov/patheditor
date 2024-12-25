import { Icon } from '@iconify/react';
import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';
import logStore from '../stores/logStore.js';
import svgStore from "../stores/svgStore.js";
import log from '../../scripts/log.js'
import { useEffect, useState } from 'react';
import SVGPathCommander from 'svg-path-commander';
import Util from '../../utils/util.js';
import { toJS } from "mobx";

const ContourPanel = observer(() => {

	const { selected,
			selectedType,
			selectedContourModeType, 
		   	selectedInletModeType,
			selectedPiercingType } = svgStore;

	const setSelectedContourModeType =(e)=> {
		let n = (Number(e.target.value))
		let newMode = 'macro'+n
		let selected = svgStore.getSelectedElement()
		if (selected) {
			let newClass =  selected.class.replace(/macro\d/gm, '')+' '+newMode
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

	const addToLog =(mess)=> {
		let now = new Date().getTime()
		logStore.add ({time: now ,action: mess})
		let data = {
			id: now,
			svg: JSON.stringify(svgStore.svgData)
		}
		log.save(data)	
	}

	const [activePoint, setActive] = useState('topYtopX')
	const [activeCooord, setActiveCoord ] = useState({x:0,y:0})
	const [wh, setWH ] = useState({w:0,h:0})
	const [angle, setAngle ] = useState('0')

	const contourPoint =(e) =>{
		let id  = e.currentTarget.getAttribute('id')
		setActive(id)
	}

	useEffect(()=>{
		let x = 0
		let y = 0
		let  path = svgStore.getSelectedElement('path') 
		console.log (path)
		if (!path) {
			setActiveCoord({x,y})
 			return	
		}
		const box = SVGPathCommander.getPathBBox(path);
		console.log (box)
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

		if(activeCooord)
		setActiveCoord({x:Util.round(x, 3),y:Util.round(y, 3)})
 	},[activePoint, selected ])

	useEffect(()=>{
		console.log ('useEffect in here')
		let x = 0
		let y = 0
		let  path = svgStore.getSelectedElement('path') 
		if (!path) {
			setActiveCoord({x,y})
 			return	
		}
		const box = SVGPathCommander.getPathBBox(path);
		if (box) {
			x = Util.round(box.width, 3)
			y = Util.round(box.height, 3)
		}
		setWH({w:x,h:y})
 	},[ selected, activePoint ])

	const handleKeyPress =(e)=> {
		let id = e.currentTarget.getAttribute('id')
		let val = Number(e.currentTarget.textContent)
		console.log (toJS (selected))
		if (e.key === 'Enter') {
			e.preventDefault()
			let path = svgStore.getSelectedElement('path') 
			let cid =  svgStore.getSelectedElement('cid') 
			let newPath =''
			if( !path ) return;
			let box = SVGPathCommander.getPathBBox(path)
			let params = {
				x:activeCooord.x,
				y:activeCooord.y,
				width:wh.w,
				height:wh.h,
				angle: angle,
				proportion: false//proportion
			}

			newPath = Util.transformContour(path, id, val, params)
/* 			if (id === 'contourWidthValue') {
				newPath = Util.transformContour(path, id, val, activeCooord.x, activeCooord.y, wh.w, wh.h)
			} else if (id  === 'contourHeightValue') {			
				newPath = Util.transformContour(path, id, val, activeCooord.x, activeCooord.y, wh.w, wh.h)	
			} else if (id  === 'contourPointXvalue') {
				newPath = Util.transformContour(path, id, val, activeCooord.x, activeCooord.y, wh.w, wh.h)
			} else if (id  === 'contourPointYvalue') {
				newPath = Util.transformContour(path, id, val, activeCooord.x, activeCooord.y, wh.w, wh.h)
			} */	

			svgStore.updateElementValue (cid, 'contour', 'path', newPath )
			addToLog ('Contour changed ' + val )
			setAngle('')
			setAngle(0)
		} 
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
                        id="operatingInletSelect"
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
				  onKeyPress={handleKeyPress}		
				  >
					{activeCooord.x}
				  </td>
				  <td>Y:</td>
				  <td id="contourPointYvalue" 
				  className="editable" 
				  contentEditable=""
				  onKeyPress={handleKeyPress}		
				  >
				  {activeCooord.y}
				  </td>
				</tr>
				<tr>
				  <td>__:</td>
				  <td id="contourWidthValue" 
				  className="editable" 
				  contentEditable=""
				  onKeyPress={handleKeyPress}		
				  >
					{wh.w}
				  </td>
				  <td>|:</td>
				  <td id="contourHeightValue" 
				  	className="editable" 
					contentEditable=""
					onKeyPress={handleKeyPress}		
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
					id="contourRotateValue" 
					className="editable" 
					contentEditable=""
					onKeyPress={handleKeyPress}	
					>
					{angle}
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
						className="btn text-white mt-1 btn_align btn_align-left"
					  >
						<Icon icon="solar:align-left-linear" width="28" height="28" />
					  </button>
					  <button
						type="button"
						className="btn text-white mt-1 btn_align btn_align-center-vertical"
					  >
						<Icon icon="solar:align-horizontal-center-linear" width="28" height="28" />
					  </button>
					  <button
						type="button"
						className="btn text-white mt-1 btn_align btn_align-right"
					  >
						<Icon icon="solar:align-right-linear" width="28" height="28" />
					  </button>
					  <button
						type="button"
						className="btn text-white mt-1 btn_align btn_align-top"
					  >
						<Icon icon="solar:align-top-linear" width="28" height="28" />
					  </button>
					  <button
						type="button"
						className="btn text-white mt-1 btn_align btn_align-center-horizontal"
					  >
						<Icon icon="solar:align-vertical-center-linear" width="28" height="28" />
					  </button>
					  <button
						type="button"
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