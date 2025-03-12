import React, { useState, useEffect } from "react";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import SVGPathCommander from "svg-path-commander";
import svgStore from "./stores/svgStore";

const LaserShow = observer(() => {
	const { laserShow } = svgStore;
	const [pathData, setPathData] = useState("");
	let timerID;


	useEffect(()=>{
		if ( laserShow.on) {
			console.log ('show must go on')
			runCutQue();
		} else {
			console.log ('Всем спасибо все свободны')
			setPathData('')
		}
	}, [laserShow.on])


	const getCommonPath = () =>{
		let commonPath =''
		console.log ('getCommonPathgetCommonPathgetCommonPath')
		const engs  =  svgStore.getFiltered(["engraving","contour"])
		const inners = svgStore.getFiltered(["inner",    "contour"])
		const outer  =  svgStore.getFiltered(["outer","contour"])
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
		let i = 0.01;
		const totalLength = Math.ceil(SVGPathCommander.getTotalLength(path));
		const moveDonor = () => {
			if (i >= totalLength) {
				return;
			}
			const point = SVGPathCommander.getPointAtLength(path, i);
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
