import React, { useState, useEffect } from 'react';
import { useCoords } from './CoordsContext';
import SvgComponent from './svg';
//import RightPanel from './rigthPanel.js';
import Util from './../utils/util';
import Arc from './../utils/arc.js';


const SvgWrapper = () => {
	const [matrix, setMatrix] = useState({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
	const [gmatrix, setGroupMatrix] = useState({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
	const [offset, setOffset] = useState({x:0,y:0});
	const [deviation, setDeviation] = useState({deviation:0,maxDeviationPoint:{x:0,y:0}});
	const [radiusX, setRadiusX] = useState(30);
	const [radiusY, setRadiusY] = useState(20);
	const [segments, setSegments] = useState(14);
	const [ell, setEllipse] = useState('M0 0');
    const [arcs, setArcs] = useState('M0 0');
    const ellepsisPath = (r1, r2) => {
        const widthSVG = 100;
        const heightSVG = 60;

        if (r1 && r2) {
            return `M${widthSVG * 0.5 - r1} ${heightSVG * 0.5} A${r1} ${r2} 0 0 0 ${widthSVG * 0.5 + r1} ${heightSVG * 0.5} A ${r1} ${r2} 0 0 0 ${widthSVG * 0.5 - r1} ${heightSVG * 0.5}`;
        } else {
            const pathElement = document.querySelector('#ellepsis');
            return pathElement ? pathElement.getAttribute('d') : 'M0 0';
        }
    };
	const { setCoords } = useCoords(); // Получаем функцию для изменения координат

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

    useEffect(() => {
        const calculatedEllipse = ellepsisPath(radiusX, radiusY);
        setEllipse(calculatedEllipse);
        const calculatedArcs = Arc.converting(calculatedEllipse, segments); 
        setArcs(calculatedArcs);
		const calculatedDeviation = Arc.findMaxDeviationPoint(calculatedEllipse, calculatedArcs, 1000 )
		setDeviation(calculatedDeviation)
    }, [radiusX, radiusY, segments]); 


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
		             
		//console.log (matrix)
		
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
		if (e.target && (e.buttons === 4 || e.buttons === 1)) {            
			let off = getMousePosition(e);
			let transforms = document.getElementById("group1").transform.baseVal.consolidate().matrix
            off.x -= transforms.e;
            off.y -= transforms.f;
			setOffset({x:off.x,y:off.y})			 
        }
	}

	const endDrag =(e) =>{
		setCoords({ x: '', y: ''})
	}

	const drag =(e) =>{
		console.log ('Drag ' + e.currentTarget.id )
		var coord = getMousePosition(e);
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
		let coords= Util.convertScreenCoordsToSvgCoords (e.clientX, e.clientY)
		setCoords({ x: Math.round( coords.y*100) / 100, y: Math.round( coords.y*100) / 100 });
	}

    const getMousePosition = (evt) => {
		var svg = document.getElementById("svg")
    	let CTM = svg.getScreenCTM();
        
        return   {
            x: (evt.clientX + CTM.f)/ CTM.a,
            y: (evt.clientY + CTM.e)/ CTM.d
        }; 
    }

	return (
		<main className="container-fluid h-100 overflow-hidden" id="parteditor">
			<div className="row  align-items-center h-100">
			<div className="w-100 h-100">
			<div  id="wrapper_svg" 
				onWheel={handleMouseWheel} 
				onMouseDown={startDrag}
				onMouseMove={drag} 
 				onMouseUp={endDrag}
				onMouseLeave={endDrag}>		 
					<SvgComponent 
						matrix={matrix} 
						gmatrix={gmatrix} 
						ell={ell}
						arcs={arcs}
						deviation={deviation}
						gridState={gridState}
						/>
				</div>
				{/* <div>
					<RightPanel 
						setRadiusX={setRadiusX} 
						setRadiusY={setRadiusY}
						setSegments={setSegments} 
						ell={ell} 
						arcs={arcs} 
						deviation={deviation}
						/>
				</div> */}
			</div>
			</div>
		</main>

	);
};

export default SvgWrapper;