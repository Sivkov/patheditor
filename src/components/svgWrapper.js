import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite'; 
import { toJS } from 'mobx'; 
import coordsStore from './stores/coordsStore.js'; 
import SvgComponent from './svg';
import Util from './../utils/util';
//import Arc from './../utils/arc.js';
import Part from '../scripts/part.js';
  

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

	const [svgParams, setSvgParams]= useState({width:0, height:0}) 

	const inMoveRef = useRef(0); 
	//const group = useRef(null);
    const wrapperSVG = useRef(null);
			
	const handleMouseWheel = (event) => {
		var svg = document.getElementById("svg")
		var gTransform = svg.createSVGMatrix()
		var group = document.getElementById("group").transform.baseVal.consolidate().matrix
		let coords = Util.convertScreenCoordsToSvgCoords(event.clientX, event.clientY);
		let scale = 1.0 + (-event.deltaY * 0.001);

		gTransform = gTransform.translate(coords.x, coords.y);
		gTransform = gTransform.scale(scale, scale);
		gTransform = gTransform.translate(-coords.x, -coords.y);

		let comboMatrix = Util.multiplyMatrices(group, gTransform)
		setMatrix({
			a: comboMatrix.a,
			b: comboMatrix.b,
			c: comboMatrix.c,
			d: comboMatrix.d,
			e: comboMatrix.e,
			f: comboMatrix.f
		});
	};

	const startDrag = (e) =>{
		console.log ('startDrag')
		inMoveRef.current = 1;		
		if (e.target && (e.buttons === 4 || e.buttons === 1)) {            
			let off = Util.getMousePosition(e);
			let transforms = document.getElementById("group1").transform.baseVal.consolidate().matrix
            off.x -= transforms.e;
            off.y -= transforms.f;
			setOffset({x:off.x,y:off.y})
        }
	}

	const endDrag =(e) =>{
		inMoveRef.current = 0;		
		// ('endDrag ' + inMoveRef.current)
	}

	const leave =(e)=>{	
		coordsStore.setCoords({ x:0,y:0});
	}

	const drag =(e) =>{
		//console.log ('Drag ' + e.currentTarget.id +'  '+inMoveRef.current)
		let coords= Util.convertScreenCoordsToSvgCoords (e.clientX, e.clientY)
		coordsStore.setCoords({ x: Math.round( coords.y*100) / 100, y: Math.round( coords.y*100) / 100 });
		if (!inMoveRef.current) return;
		var coord = Util.getMousePosition(e);
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

			let coords1 = Util.convertScreenCoordsToSvgCoords(xd, yd);
			let center = Util.convertScreenCoordsToSvgCoords(wBox.x+wBox.width*0.5, wBox.y+wBox.height*0.5)
		
			let outerBox = document.querySelector('#contours').getBoundingClientRect()
			let oxd = (outerBox.x + outerBox.width * 0.5)
			let oyd = (outerBox.y + outerBox.height * 0.5)

			let dif = Util.convertScreenCoordsToSvgCoords(oxd, oyd)
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

    const updateRect =()=> {
		var svg = document.getElementById("svg")
        var rect = document.querySelector('#wrapper_svg').getBoundingClientRect();        
        var point = svg.createSVGPoint();
        point.y = rect.top;
        point.x = rect.left;
        let top = point.matrixTransform(document.querySelector('#group').getScreenCTM().inverse());

        var point1 = svg.createSVGPoint();
        point1.y = rect.bottom;
        point1.x = rect.right;
        let bottom = point1.matrixTransform(document.querySelector('#group').getScreenCTM().inverse());
 
        let width =  bottom.x  - top.x
        let height =  bottom.y - top.y    
        setRectParams({x:top.x, y:top.y, width: width, height: height})

    } 

	const calculateRectAttributes = () => {
		const widthSVG = svgParams.width
		const heightSVG = svgParams.height
	
        // Ширина и высота исходя из scale
        const combinedMatrix = Util.multiplyMatrices(gmatrix, matrix);
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
							onWheel={handleMouseWheel} 
							onMouseDown={startDrag}
							onMouseMove={drag} 
							onMouseUp={endDrag}
							onMouseLeave={leave}>		 
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