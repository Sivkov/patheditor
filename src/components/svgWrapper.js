import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite'; 
//import { toJS } from 'mobx'; 
import coordsStore from './stores/coordsStore.js'; 
import editorStore from './stores/editorStore.js'; 
import SvgComponent from './svg';
import util from './../utils/util';
import Part from '../scripts/part.js';
//import tch from './../scripts/touches'
import inlet from './../scripts/inlet.js'
import svgStore from './stores/svgStore.js';
import { addToLog } from '../scripts/addToLog.js';


var tch = {}
tch.evCache = new Array();
var prevDiff = -1;
  

const  SvgWrapper = observer (() => {
	const [matrix, setMatrix] = useState({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
	const [gmatrix, setGroupMatrix] = useState({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
	const [offset, setOffset] = useState({x:0,y:0});
	const [rectParams, setRectParams] = useState({x:0, y:0, width:0, heigh:0});
	const [gridState, setGridState] = useState({
		xsGrid: {
			visibility: "visible",
			fill: "var(--gridColorFill)",
  		},
		smallGrid: {
			visibility: "visible",
			fill: "none",
 		},
		grid: {
			visibility: "visible",
			fill: "none",
		},
	});
	const [wrapperClass, setWrapperClass] = useState('')

	const [svgParams, setSvgParams]= useState({width:0, height:0}) 

	const inMoveRef = useRef(0); 
	//const group = useRef(null);
    const wrapperSVG = useRef(null);
			
	const handleMouseWheel = (event) => {
		var svg = document.getElementById("svg")
		var gTransform = svg.createSVGMatrix()
		var group = document.getElementById("group").transform.baseVal.consolidate().matrix
		let coords = util.convertScreenCoordsToSvgCoords(event.clientX, event.clientY);
		let scale = 1.0 + (-event.deltaY * 0.001);

		gTransform = gTransform.translate(coords.x, coords.y);
		gTransform = gTransform.scale(scale, scale);
		gTransform = gTransform.translate(-coords.x, -coords.y);

		let comboMatrix = util.multiplyMatrices(group, gTransform)
		setMatrix({
			a: comboMatrix.a,
			b: comboMatrix.b,
			c: comboMatrix.c,
			d: comboMatrix.d,
			e: comboMatrix.e,
			f: comboMatrix.f
		});
	};

	const touchZoom = (event, curDiff, prevDiff) =>{
		console.log ('** touchZoom **')
		var svg = document.getElementById("svg")
        // Коэффициент масштабирования на основе разницы расстояний
        let scale = curDiff / prevDiff;
		var group = document.getElementById("group").transform.baseVal.consolidate().matrix

        // Вычисление координат центра между двумя точками касания
        let x = (tch.evCache[0].clientX + tch.evCache[1].clientX) / 2;
        let y = (tch.evCache[0].clientY + tch.evCache[1].clientY) / 2;
        let coords = util.convertScreenCoordsToSvgCoords(x, y);
    
        // Применение трансформации
		var gTransform = svg.createSVGMatrix()
        gTransform = gTransform.translate(coords.x, coords.y);
        gTransform = gTransform.scale(scale, scale);
        gTransform = gTransform.translate(-coords.x, -coords.y);
		let comboMatrix = util.multiplyMatrices(group, gTransform)
		
		setMatrix({
			a: comboMatrix.a,
			b: comboMatrix.b,
			c: comboMatrix.c,
			d: comboMatrix.d,
			e: comboMatrix.e,
			f: comboMatrix.f
		});
    
     /*    // Применение трансформации к элементу SVG
        let transform = part.svg.createSVGTransform();
        transform.setMatrix(part.gTransform);
        part.group.transform.baseVal.initialize(transform);
        part.updateRect() */
    }
 
	const pointerdown_handler = (ev) => {
		ev.preventDefault()
 		console.log ('pointer_down_')
		tch.evCache.push(ev);
	}

	const pointermove_handler = (ev) => {
		console.log('pointer_move_');
		ev.preventDefault()
		for (let i = 0; i < tch.evCache.length; i++) {
			if (ev.pointerId === tch.evCache[i].pointerId) {
				tch.evCache[i] = ev;
				break;
			}
		}
	
		if (tch.evCache.length === 2) {
			let curDiff = Math.sqrt(
				Math.pow(tch.evCache[1].clientX - tch.evCache[0].clientX, 2) +
				Math.pow(tch.evCache[1].clientY - tch.evCache[0].clientY, 2)
			);
	
			if (prevDiff > 0) {
				if (curDiff !== prevDiff) {
					touchZoom(ev, curDiff, prevDiff);
				}
			}
			prevDiff = curDiff;
		} 
	}

	const pointerup_handler = (ev) => {
		ev.preventDefault()
 		//console.log ('pointer_up_')
		remove_event(ev);
		if (tch.evCache.length < 2) prevDiff = -1;
	}

	const remove_event = (ev) => {
		ev.preventDefault()
		// ev.stopPropagation()
		console.log ('remove_event_')
		for (var i = 0; i <tch.evCache.length; i++) {
			if (true ||tch.evCache[i].pointerId == ev.pointerId) {
				tch.evCache.splice(i, 1);
				break;
			}
		}
	}

	const startDrag = (e) =>{
		console.log ('startDrag' + e.buttons)
		inMoveRef.current = 1;	
		if (e.target && (e.buttons === 4  || editorStore.mode== 'drag')) {    

			let off = util.getMousePosition(e);
			let transforms = gmatrix //document.getElementById("group1").transform.baseVal.consolidate().matrix
            off.x -= transforms.e;
            off.y -= transforms.f;
			setOffset({x:off.x,y:off.y})

        } else if (e.button === 0 && editorStore.mode === 'selectPoint') {

			console.log ("editorStore.mode   "+editorStore.mode)
			let searchResult = util.findNearesPoint(e)
			svgStore.setSelectedPointOnEdge(searchResult)
	
			
		} else if (e.button === 0 && editorStore.mode === 'addPoint') {
			
			console.log ("editorStore.mode   "+editorStore.mode)
			let contours = svgStore.getFiltered('contour')
			let coords = util.convertScreenCoordsToSvgCoords(e.clientX, e.clientY);			
			let min = Infinity
			let point;

			contours.forEach((contour)=>{
				let path = contour.path
				let nearest = util.findNearestPointOnPath (path, { x: coords.x, y: coords.y })
				let distance = util.distance(coords.x, coords.y, nearest.x, nearest.y )
				if (distance < min) {
					min=distance
					point=nearest
					point.cid = contour.cid
					point.path= contour.path
					point.command = nearest.command
				}		
			})
			svgStore.setSelectedPointOnPath(point)
	

		} else if (e.button === 2) {		
			console.log ('ку - ку')
		} 
	}

	const endDrag =(e) =>{
		inMoveRef.current = 0;	
		if (svgStore.pointInMove) {
			addToLog("Contour was changed")
			svgStore.setPointInMove(false)
		}
		if (editorStore.mode === 'dragging') {
			if (svgStore.selectedPointOnEdge) {
				editorStore.setMode('selectPoint')
			} else if (svgStore.selectedPointOnPath) {
				editorStore.setMode('addPoint')
			} else if (svgStore.selectedPath) {
				editorStore.setMode('resize')
			} else {
				editorStore.setMode('resize')
			}
		}
	}

	const leave =(e)=>{	
		coordsStore.setCoords({ x:0,y:0});
	}

	const drag =(e) =>{

 		let coords= util.convertScreenCoordsToSvgCoords (e.clientX, e.clientY)
		coordsStore.setCoords({ x: Math.round( coords.x*100) / 100, y: Math.round( coords.y*100) / 100 });
		if (e.target && 
				(
					(e.buttons === 4)  || 
					(editorStore.mode== 'drag' && e.buttons === 1) || 
					(editorStore.mode== 'dragging' && e.buttons === 1)
				)
			) 
		{
			if (!inMoveRef.current) return;
			var coord = util.getMousePosition(e);
			if (e.target && (e.buttons === 4 || e.buttons === 1)){
				gmatrix.e = (coord.x - offset.x)
				gmatrix.f = (coord.y - offset.y) 
				setGroupMatrix({
					a: gmatrix.a,
					b: gmatrix.b,
					c: gmatrix.c,
					d: gmatrix.d,
					e: gmatrix.e,
					f: gmatrix.f,
				})
			}
			editorStore.setMode('dragging')
		} else if ( e.buttons === 1  &&   editorStore.inletMode === 'inletInMoving') {
			inlet.getNewPathsInMove (coords)				
		} else if (e.button === 0 && svgStore.pointInMove) {
			util.pointMoving(e, coords)			
		}		
	}
 
	useEffect(() => {
	  if (true) {
		setSvgParams(Part.getSvgParams())
 		const timeoutId = setTimeout(() => {
			console.log ('Delayed message after 2 seconds!');
 			fitToPage()
		}, 100);
	  		return () => clearTimeout(timeoutId); 
		}
	}, []); 

	useEffect(() => { 
		if (coordsStore.needeToFit) {
 			fitToPage()		 
		}		
	}, [coordsStore.needeToFit]); 

	const fitToPage =() => {
		console.log (coordsStore.fittedPosition)

		if (!coordsStore.fittedPosition) {
			console.log('calculate without store')

			setRectParams({x:0, y:0, width: 0, height: 0})
			setMatrix({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })
			setGroupMatrix({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })

			let box = document.querySelector('#group').getBoundingClientRect()
			const wBox = wrapperSVG.current.getBoundingClientRect();
			
			let scaleW = wBox.width/ box.width
			let scaleH = wBox.height / box.height
			let scale = scaleW < scaleH ? scaleW : scaleH

			let xd = (box.x + box.width * 0.5)
			let yd = (box.y + box.height * 0.5)

			let coords1 = util.convertScreenCoordsToSvgCoords(xd, yd);
			let center = util.convertScreenCoordsToSvgCoords(wBox.x+wBox.width*0.5, wBox.y+wBox.height*0.5)
		
			let outerBox = document.querySelector('#contours').getBoundingClientRect()
			let oxd = (outerBox.x + outerBox.width * 0.5)
			let oyd = (outerBox.y + outerBox.height * 0.5)

			let dif = util.convertScreenCoordsToSvgCoords(oxd, oyd)
			let ydif = dif.y - center.y
			let xdif = dif.x - center.x

			let matrix = { a: scale, b: 0, c: 0, d: scale, e: coords1.x - coords1.x * scale-xdif, f: coords1.y - coords1.y * scale-ydif }
			setGroupMatrix (matrix)
 			coordsStore.setFitted(false)
			coordsStore.setFittedPosition ({matrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, gmatrix: matrix , rectParams:rectParams})

		} else {
			console.log('from store')
	 		setMatrix(coordsStore.fittedPosition.matrix)
			setGroupMatrix(coordsStore.fittedPosition.gmatrix)
			setRectParams(coordsStore.fittedPosition.rectParams)
			coordsStore.setFitted(false)
 
		/*	TODO: доделть смещение e f.
			масштаб поучаем из мм1
			а вот смещение надо рпассчитать как отклонение центра swgWrapper от центра outer при том что это  постоянное 
			соотношение... от соотношение рахмеров окна и svg
			console.log ("matrix  " + JSON.stringify(toJS(coordsStore.fittedPosition.matrix)))
			console.log ( "gmatrix  " + JSON.stringify(toJS(coordsStore.fittedPosition.gmatrix)))

			
			let mm1 = document.querySelector('#group1').transform.baseVal.consolidate().matrix
			console.log(mm1)
			setMatrix( { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })
			setGroupMatrix(mm1)
			coordsStore.setFitted(false)		
  			*/
		}	
    }

	useEffect(() => {
		const updatedState = { ...gridState };
		if (matrix.a < 0.25) {
		updatedState.xsGrid.visibility = "hidden";
		updatedState.smallGrid.fill = "var(--gridColorFill)";
		} else {
		updatedState.xsGrid.visibility = "visible";
		updatedState.smallGrid.fill = "none";
		}

		if (matrix.a < 0.125) {
		updatedState.smallGrid.visibility = "hidden";
		updatedState.grid.fill = "var(--gridColorFill)";
		} else {
		updatedState.smallGrid.visibility = "visible";
		updatedState.grid.fill = "none";
		}

		if (matrix.a > 85) {
		updatedState.grid.visibility = "hidden";
		} else {
		updatedState.grid.visibility = "visible";
		}
		setGridState(updatedState);
	}, [matrix]);

  	useEffect(()=>{
			setRectParams( calculateRectAttributes())
	},[matrix, gmatrix, offset])  

	useEffect(()=>{
		console.log (editorStore.mode)
		if (editorStore.mode === 'resize') {
			setWrapperClass('cursorArrow')
		} else if (editorStore.mode === 'drag') {
			setWrapperClass('cursorGrab')
		} else if (editorStore.mode === 'dragging') {
			setWrapperClass('cursorGrabbing')
		} else if (editorStore.mode === 'addPoint') {
			setWrapperClass('cursorCustomPlus')
		} else if (editorStore.mode === 'selectPoint') {
			setWrapperClass('cursorSelecPoint')
		} else {
			setWrapperClass('cursorArrow')
		}
	},
	[editorStore.mode])

	const calculateRectAttributes = () => {
		const widthSVG = svgParams.width
		const heightSVG = svgParams.height
	
        // Ширина и высота исходя из scale
        const combinedMatrix = util.multiplyMatrices(gmatrix, matrix);
        const scaleX = combinedMatrix.a;
        const scaleY = combinedMatrix.d;

        const width = widthSVG/ scaleX;
        const height = heightSVG / scaleY;

        // Координаты x и y исходя из translate
        const x = -combinedMatrix.e / scaleX;
        const y = -combinedMatrix.f / scaleY;

        return { x:x, y:y, width:width, height:height }
    };


	return (
		<main className="container-fluid h-100 overflow-hidden" id="parteditor">
			<div className="row  align-items-center h-100">
				<div className="w-100 h-100">
					<div className="d-flex" id="editor_main_wrapper">
						<div id="wrapper_svg" ref={wrapperSVG}
		 					onWheel = {handleMouseWheel} 
							onMouseDown = {startDrag}
							onMouseMove = {drag} 
							onMouseUp = {endDrag}
							onMouseLeave = {leave}
							className={ wrapperClass }		 
							/* TODO RESIZING using touches onPointerDown = {pointerdown_handler}
							onPointerMove = {pointermove_handler}
							onPointerUp = {pointerup_handler}
							onPointerCancel = {pointerup_handler}
							onPointerOut = {pointerup_handler}
							onPointerLeave = {pointerup_handler}*/> 
								<SvgComponent 
									matrix={matrix} 
									gmatrix={gmatrix} 
									gridState={gridState}
									svgParams={svgParams}
									rectParams={rectParams}
								/>
						</div>
					</div>
				</div>	
			</div>
		</main>

	);
});

export default SvgWrapper;