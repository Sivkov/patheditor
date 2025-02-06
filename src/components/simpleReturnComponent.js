import { observer } from "mobx-react-lite";
import svgStore from "./stores/svgStore.js";
import editorStore from "./stores/editorStore.js";
import Part from "./../scripts/part";
import React, { useEffect, useState } from 'react';
//import util from "../utils/util.js";

const SimpleReturnComponent = observer(() => {

	//const handle = 0;
	//const partNumber = 6;
	//var url = new URL(location.href);
	var url = new URL(window.location.href);
	var searchParams = new URLSearchParams(url.search);
	var handle = searchParams.get('handle') || 0;
	var partNumber = searchParams.get('part') || 0;

	const {
		selectedCid,
		//selectedPath,
		//selectedInletPath
	} = svgStore;

	useEffect(() => {
		const fetchData = async () => {
			const svg = await Part.getPartCode(handle, partNumber); // Получаем данные
			const newSvgData = {
				width: svg.width,
				height: svg.height,
				code: svg.code,
				params: svg.params
			};
			svgStore.setSvgData(newSvgData);
		};
		fetchData();

	}, []);

	const setSelected = (e) => {
		let cid = Number(e.currentTarget.getAttribute('data-cid'));
		if (typeof cid === 'number') {
			if (cid !== selectedCid) {
				svgStore.setContourSelected(cid)
			} else {
				//console.log (e)
				let inlet = e.currentTarget.classList.contains('inlet')
				let outlet = e.currentTarget.classList.contains('outlet')				
				if ( (inlet || outlet) && editorStore.inletMode === 'move') {
					editorStore.setInletMode('inletInMoving')
					console.log ('setSelected and start in mode  ' + editorStore.inlrtMode)
					
				}				
			}
		}
	}

	const detectCanMove =()=>{
		if (editorStore.inletMode === 'inletInMoving') {
			editorStore.setInletMode('move')
		} 
	} 

	return (
		<>
			{svgStore.svgData['code'].map((element, i) => (
				<g
					key={i}
					data-cid={element.cid}
					className={element.class}
					//onMouseDown={element.class.includes('contour') ? setSelected : ()=>{}}
					onMouseDown={setSelected}
					onMouseUp={detectCanMove}
					fill={element.class.includes("inner") ? "url(#grid)" : ""}
				>
					<path d={element.path}></path>
				</g>
			))}
		
		</>
	);
 });

export default SimpleReturnComponent;