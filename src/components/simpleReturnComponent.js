import { observer } from "mobx-react-lite";
import svgStore from "./stores/svgStore.js";
import editorStore from "./stores/editorStore.js";
import Part from "./../scripts/part";
import React, { useEffect, useState } from 'react';
import util from "../utils/util.js";

const SimpleReturnComponent = observer(() => {

	const handle = 0;
	const partNumber = 6;

	const {
		selectedCid,
		selectedPath,
		selectedInletPath
	} = svgStore;

	const [point, setPoint] = useState({x:0,y:0})

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
				if ( (inlet || outlet) && editorStore.mode === 'inletCanMove') {
					editorStore.setMode('inletInMoving')
					console.log ('setSelected and start in mode  ' + editorStore.mode)

					let coord = util.convertScreenCoordsToSvgCoords(e.clientX, e.clientY);  
					let	nearest = util.findNearestPointOnPath (selectedPath, coord)
					setPoint(nearest)
					
				}				
			}
		}
	}

	const detectCanMove =()=>{
		if (editorStore.mode === 'inletInMoving') {
			editorStore.setMode('inletCanMove')
		} 
	}

	const updatePoint = (e) => {
		if (editorStore.mode === 'inletInMoving') {
			let coord = util.convertScreenCoordsToSvgCoords(e.clientX, e.clientY);  
			let	nearest = util.findNearestPointOnPath (selectedPath, coord)
			setPoint(nearest)
		}				
	}

	return (
		<>
			<g
				onMouseMove={ updatePoint }
			>
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
				<circle
					r={1}
					strokeWidth={1}
					fill="pink" stroke="white"
					cx={ point.x}
					cy={ point.y}>
				</circle>
			</g>
			
		</>
	);
	//}         
});

export default SimpleReturnComponent;