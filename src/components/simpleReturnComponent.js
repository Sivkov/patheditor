import { observer } from "mobx-react-lite";
import svgStore from "./stores/svgStore.js";
import editorStore from "./stores/editorStore.js";
import Part from "./../scripts/part";
import React, { useEffect } from 'react';

const SimpleReturnComponent = observer(() => {

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
		//console.log ("Button number   "+e.button)
		if (e.button === 0 && editorStore.mode === 'resize') {
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
						//console.log ('setSelected and start in mode  ' + editorStore.inlrtMode)						
					}				
				}
			}
		} else if ((e.button === 0 && editorStore.mode === 'text')) {

			console.log ('Create text element')
			let coords ={x:e.clientX, y:e.clientY}
			svgStore.addTextElement ( coords )
 			svgStore.setTextFocus( true )
			
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