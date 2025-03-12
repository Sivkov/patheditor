import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import svgStore from "./stores/svgStore";

const LaserShow = observer(() => {
	const { laserShow } = svgStore;
	const [pathData, setPathData] = useState("");
	let timerID;


	useEffect(()=>{
		if ( laserShow.on) {
			runCutQue();
		} else {
			setPathData('')
		}
	}, [laserShow.on])


	const getCommonPath = () =>{
		let commonPath =''
		console.log ('getCommonPathgetCommonPathgetCommonPath')
		const engs  =  svgStore.getFiltered(["engraving","contour"], ['macro5'])
		const inners = svgStore.getFiltered(["inner",    "contour"], ['macro5'])
		const outer  =  svgStore.getFiltered(["outer","contour"], ['macro5'])
		engs.forEach(e => commonPath+=(" "+ e.path))
		inners.forEach(e => {
			let inlet = svgStore.getElementByCidAndClass(e.cid, 'inlet', 'path')||''
			commonPath+=(" "+ inlet)
			commonPath+=(" "+ e.path)
			let outlet = svgStore.getElementByCidAndClass(e.cid, 'outlet', 'path')||''
			commonPath+=(" "+ outlet)

		})

		outer.forEach(e => {
			let inlet = svgStore.getElementByCidAndClass(e.cid, 'inlet', 'path')||''
			commonPath+=(" "+ inlet)
			commonPath+=(" "+ e.path)
			let outlet = svgStore.getElementByCidAndClass(e.cid, 'outlet','path')||''
			commonPath+=(" "+ outlet)
		})
		return commonPath

	}


	const runCutQue = () => {
		
		const path = getCommonPath()
		const svgNS = "http://www.w3.org/2000/svg";
		const ppath = document.createElementNS(svgNS, "path");
		ppath.setAttribute("d", path);
		const totalLength = Math.ceil(ppath.getTotalLength());

		let i = 0.01;
		const moveDonor = () => {
			if (i >= totalLength) return;
			const point = ppath.getPointAtLength( i );
			setPathData((prevPathData) =>
				prevPathData ?	`${prevPathData} ${point.x} ${point.y}` : `M ${point.x} ${point.y}`
			);
			i += 1;
			const speed = (100 - laserShow.speed);
			console.log (speed)
			if (laserShow.on) {
				timerID = setTimeout(moveDonor, speed);
			} else {
				setPathData('')
				clearTimeout( timerID )
			}
		};
		moveDonor();
	};

	return (
		laserShow && <path
			id="laserShow"
			className="cutDot"
			fill="none"
			stroke="white"
			d={pathData}
			strokeWidth="1"
		/>
	);
});

export default LaserShow;
