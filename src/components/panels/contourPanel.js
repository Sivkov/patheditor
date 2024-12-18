import { Icon } from '@iconify/react';
import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';
//import logStore from '../logStore.js';
import svgStore from "../svgStore.js";
//import log from '../../scripts/log.js'
//import Part from '../../scripts/part.js'
//import { toJS } from "mobx";
//import { useState } from 'react';


const ContourPanel = observer(() => {

	const { selectedType } = svgStore;
	const panelInfo = [
		{
			id: "contourPopup",
			mini: false,
			fa: (<><Icon icon="oui:polygon" width="24" height="24" style={{ color: 'white' }} className='me-2' /><div>Contour</div></>),
			style: {
				top: 0,
				left: 300,
				width: 200,
				height: 340,
			},
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
						>
							<option value={-1} />
							<option value={0}>normal</option>
							<option value={-1}>without_time</option>
							<option value={1}>pulse</option>
						</select>
				  </td>
				</tr>
				<tr style={{ height: "1.5rem" }}>
				  <td colSpan={2} className="text-start ps-2">
					Inlet:part.createOperatingPanel()
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
                    >
                    <option value={-1} />
                    <option value={0}>cutting</option>
                    <option value={1}>pulse</option>
                    <option value={2}>engraving</option>
                    <option value={3}>macro3</option>
                    <option value={4}>macro4</option>
                    <option value={5}>cutless</option>
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
				  >
					 
					 <select
                        id="operatingInletSelect"
                        className="form-select"
                        aria-label="Default select example"
                        >
                        <option value={-1} />
                        <option value={0}>cutting</option>
                        <option value={1}>pulse</option>
                        <option value={2}>engraving</option>
                        <option value={3}>macro3</option>
                        <option value={4}>macro4</option>
                        <option value={5}>cutless</option>
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
						  <div className="contourPoint active topY topX" />
						  <div className="contourPoint topY botX" />
						  <div className="contourPoint botY topX" />
						  <div className="contourPoint botY botX" />
						  <div className="contourPoint midX topY" />
						  <div className="contourPoint midX botY" />
						  <div className="contourPoint midY topX" />
						  <div className="contourPoint midY botX" />
						  <div className="contourPoint midX midY" />
						</div>
					  </div>
					</div>
				  </td>
				  <td>X:</td>
				  <td id="contourPointXvalue" className="editable" contentEditable="">
					0
				  </td>
				  <td>Y:</td>
				  <td id="contourPointYvalue" className="editable" contentEditable="">
					0
				  </td>
				</tr>
				<tr>
				  <td>__:</td>
				  <td id="contourWidthValue" className="editable" contentEditable="">
					0
				  </td>
				  <td>|:</td>
				  <td id="contourHeightValue" className="editable" contentEditable="">
					0
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
					  <i className="fa-solid fa-angle-90" />
					  <div
						style={{ fontFamily: '"Font Awesome 6 Pro"', marginTop: "-7px" }}
					  >
						°
					  </div>
					</div>
				  </td>
				  <td id="contourRotateValue" className="editable" contentEditable="">
					0
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
						<i className="fa-solid fa-objects-align-left" />
					  </button>
					  <button
						type="button"
						className="btn text-white mt-1 btn_align btn_align-center-vertical"
					  >
						<i className="fa-solid fa-objects-align-center-horizontal" />
					  </button>
					  <button
						type="button"
						className="btn text-white mt-1 btn_align btn_align-right"
					  >
						<i className="fa-solid fa-objects-align-right" />
					  </button>
					  <button
						type="button"
						className="btn text-white mt-1 btn_align btn_align-top"
					  >
						<i className="fa-solid fa-objects-align-left fa-rotate-90" />
					  </button>
					  <button
						type="button"
						className="btn text-white mt-1 btn_align btn_align-center-horizontal"
					  >
						<i className="fa-solid fa-objects-align-center-vertical" />
					  </button>
					  <button
						type="button"
						className="btn text-white mt-1 btn_align btn_align-bottom"
					  >
						<i className="fa-solid fa-objects-align-right fa-rotate-90" />
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
						<div>Rounding radius</div>
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