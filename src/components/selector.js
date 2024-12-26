import { observer } from "mobx-react-lite";
import svgStore from "./stores/svgStore.js";
import editorStore from "./stores/editorStore.js";
import SVGPathCommander from 'svg-path-commander';
import Util from "../utils/util.js";
import { useEffect, useState } from "react";

const Selector = observer(() => {

	const { selectedPath, selectedCid } = svgStore;
	const [selectorCoords, setSelectorCoords] = useState({ x: 0, y: 0, width: 0, height: 0 })
	const [visibility, setVisibility] = useState( false )
	const [ inMove, setInmove] = useState( false ) 
	useEffect(()=>{
		if (!selectedPath) {
			setSelectorCoords({ x: 0, y: 0, width: 0, height: 0 })
			setVisibility(false)
		} else {
			setVisibility(true)
			if (!inMove) {
				const box = SVGPathCommander.getPathBBox(selectedPath);
				setSelectorCoords({ x: box.x, y: box.y, width: box.width, height: box.height })
			}		
		}
	},[ selectedCid ])


	let circleSize = 2
	//circleSize = circleSize > 2 ? 2 : circleSize
	let part = {};
	part.svg = document.getElementById("svg")

	const handleMouseDown = (e) => {
		setInmove(true)
		if (editorStore.mode !== "resize") return;
		part.resizingHandle = e.currentTarget.id;
		part.start = Util.convertScreenCoordsToSvgCoords(e.clientX, e.clientY);
		part.dif = {}
		part.dif.x = selectorCoords.x +selectorCoords.width*0.5 - part.start.x
		part.dif.y = selectorCoords.y - part.start.y

		const cbox = SVGPathCommander.getPathBBox(selectedPath);
		part.initialRectLeft = cbox.x;
        part.initialRectTop = cbox.y;
		part.initialHeight = cbox.height
		part.initialWidth = cbox.width

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseleave', handleMouseUp);
		document.addEventListener('mouseup', handleMouseUp);
		console.log('handleMouseDown ** ** ' + part.resizingHandle)

	}
	const handleMouseMove = (e) => {
		let newCoords;
		part.current = Util.convertScreenCoordsToSvgCoords(e.clientX, e.clientY);
		
		switch (part.resizingHandle) {
			case 'selectorGrip_resize_n':                
				newCoords = {
					x: selectorCoords.x,
					y: part.current.y,
					width: selectorCoords.width,
					height: selectorCoords.y - part.current.y + selectorCoords.height,
				};
				break;
	
			case 'selectorGrip_resize_nw':
				newCoords = {
					x: part.current.x,
					y: part.current.y,
					width: selectorCoords.x + selectorCoords.width - part.current.x,
					height: selectorCoords.y - part.current.y + selectorCoords.height,
				};
				break;
	
			case 'selectorGrip_resize_w':
				newCoords = {
					x: part.current.x,
					y: selectorCoords.y,
					width: selectorCoords.x + selectorCoords.width - part.current.x,
					height: selectorCoords.height,
				};
				break;
	
			case 'selectorGrip_resize_sw':
				newCoords = {
					x: part.current.x,
					y: selectorCoords.y,
					width: selectorCoords.x + selectorCoords.width - part.current.x,
					height: part.current.y - selectorCoords.y,
				};
				break;
	
			case 'selectorGrip_resize_s':
				newCoords = {
					x: selectorCoords.x,
					y: selectorCoords.y,
					width: selectorCoords.width,
					height: part.current.y - selectorCoords.y,
				};
				break;
	
			case 'selectorGrip_resize_se':
				newCoords = {
					x: selectorCoords.x,
					y: selectorCoords.y,
					width: part.current.x - selectorCoords.x,
					height: part.current.y - selectorCoords.y,
				};
				break;
	
			case 'selectorGrip_resize_e':
				newCoords = {
					x: selectorCoords.x,
					y: selectorCoords.y,
					width: part.current.x - selectorCoords.x,
					height: selectorCoords.height,
				};
				break;
	
			case 'selectorGrip_resize_ne':
				newCoords = {
					x: selectorCoords.x,
					y: part.current.y,
					width: part.current.x - selectorCoords.x,
					height: selectorCoords.y - part.current.y + selectorCoords.height,
				};
				break;
	
			case 'selectorGrip_central':
				newCoords = {
					x: part.current.x - selectorCoords.width / 2,
					y: part.current.y - selectorCoords.height / 2,
					width: selectorCoords.width,
					height: selectorCoords.height,
				};
				break;
		}

		if (newCoords.height <= 0 || newCoords.width <= 0 || !newCoords.x || !newCoords.y) return;
		
		setSelectorCoords(newCoords);

 		let scaleX = newCoords.width / part.initialWidth
        let scaleY = newCoords.height / part.initialHeight
        let translateX = newCoords.x - newCoords.x * scaleX
        let translateY = newCoords.y - newCoords.y * scaleY

        translateX = newCoords.x - newCoords.x * scaleX - (part.initialRectLeft - newCoords.x) * scaleX
        translateY = newCoords.y - newCoords.y * scaleY - (part.initialRectTop - newCoords.y) * scaleY

		console.log (selectorCoords.width, part.initialWidth)

		let newPath = Util.applyTransform (svgStore.selectedPath, scaleX, scaleY, translateX, translateY)
		let cid =  svgStore.getSelectedElement('cid') 
		svgStore.updateElementValue (cid, 'contour', 'path', newPath )

 	 	part.initialHeight = newCoords.height
		part.initialWidth = newCoords.width 
		part.initialRectLeft = newCoords.x
        part.initialRectTop = newCoords.y

		let element =  document.querySelector('g[data-cid="5"] path')
		element.setAttribute('d', newPath)

	};

	const handleMouseUp = (e) => {
		part = {};
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
		setInmove(false)

		/* 
		if (e.type === 'mouseup') {
			 document.removeEventListener('mousemove', part.handleMouseMove);
			 document.removeEventListener('mouseup', part.handleMouseUp);
		} else if (e.type === 'touchend') {
			 document.removeEventListener('touchmove', part.handleMouseMove);
			 document.removeEventListener('touchend', part.handleMouseUp);
 
			 e.currentTarget.removeEventListener('touchmove', part.handleMouseMove);
			 e.currentTarget.removeEventListener('touchend', part.handleMouseUp);
		}
 
		log.add(__("Free transformation"));
		panels.updateSortableList()
		// if (document.querySelector(".selectedContour").classList.contains('outer')) part.normalizeIntends();
		*/

	}

	return (
		<>
			<g id="selectorPart" className={visibility ? '' : 'd-none'}>
				<rect
					x={selectorCoords.x}
					y={selectorCoords.y}
					width={selectorCoords.width}
					height={selectorCoords.height}
					fill="none"
					stroke="black"
					strokeWidth={circleSize / 10}>
				</rect>
				<circle
					onMouseDown={handleMouseDown}
					id="selectorGrip_resize_nw"
					fill="black" stroke="white"
					r={circleSize}
					style={{ cursor: "nwResize" }}
					strokeWidth={circleSize / 10}
					pointerEvents="all"
					cx={selectorCoords.x}
					cy={selectorCoords.y}>
				</circle>
				<circle
					onMouseDown={handleMouseDown}
					id="selectorGrip_resize_ne"
					fill="black" stroke="white"
					r={circleSize}
					style={{ cursor: "neResize" }}
					strokeWidth={circleSize / 10}
					pointerEvents="all"
					cx={selectorCoords.x + selectorCoords.width}
					cy={selectorCoords.y}>
				</circle>
				<circle
					onMouseDown={handleMouseDown}
					id="selectorGrip_resize_sw"
					fill="black" stroke="white"
					r={circleSize}
					style={{ cursor: "swResize" }}
					strokeWidth={circleSize / 10}
					pointerEvents="all"
					cx={selectorCoords.x}
					cy={selectorCoords.y + selectorCoords.height}>
				</circle>
				<circle
					onMouseDown={handleMouseDown}
					id="selectorGrip_resize_se"
					fill="black" stroke="white"
					r={circleSize}
					style={{ cursor: "seResize" }}
					strokeWidth={circleSize / 10}
					pointerEvents="all"
					cx={selectorCoords.x + selectorCoords.width}
					cy={selectorCoords.y + selectorCoords.height}>
				</circle>
				<circle
					onMouseDown={ handleMouseDown }
					id="selectorGrip_resize_n"
					fill="black" stroke="white"
					r={circleSize}
					style={{ cursor: "nResize" }}
					strokeWidth={circleSize / 10}
					pointerEvents="all"
					cx={selectorCoords.x + selectorCoords.width * 0.5}
					cy={selectorCoords.y}>
				</circle>
				<circle
					onMouseDown={handleMouseDown}
					id="selectorGrip_resize_w"
					fill="black" stroke="white"
					r={circleSize}
					style={{ cursor: "wResize" }}
					strokeWidth={circleSize / 10}
					pointerEvents="all"
					cx={selectorCoords.x}
					cy={selectorCoords.y + selectorCoords.height * 0.5}>
				</circle>
				<circle
					onMouseDown={handleMouseDown}
					id="selectorGrip_resize_s"
					fill="black" stroke="white"
					r={circleSize}
					style={{ cursor: "sResize" }}
					strokeWidth={circleSize / 10}
					pointerEvents="all"
					cx={selectorCoords.x + selectorCoords.width * 0.5}
					cy={selectorCoords.y + selectorCoords.height}>
				</circle>
				<circle
					onMouseDown={handleMouseDown}
					id="selectorGrip_resize_e"
					fill="black" stroke="white"
					r={circleSize}
					style={{ cursor: "eResize" }}
					strokeWidth={circleSize / 10}
					pointerEvents="all"
					cx={selectorCoords.x + selectorCoords.width}
					cy={selectorCoords.y + selectorCoords.height * 0.5}>
				</circle>
				<circle
					onMouseDown={handleMouseDown}
					id="selectorGrip_central"
					fill="white" stroke="black"
					r={circleSize}
					style={{ cursor: "move" }}
					strokeWidth={circleSize / 10}
					pointerEvents="all"
					cx={selectorCoords.x + selectorCoords.width * 0.5}
					cy={selectorCoords.y + selectorCoords.height * 0.5}>
				</circle>
			</g>
		</>
	);
})

export default Selector;
