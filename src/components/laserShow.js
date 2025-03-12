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
			setPathData('M ')
		}
	}, [laserShow.on])


	const runCutQue = () => {
		
		const path = svgStore.getElementByCidAndClass(7, "contour", "path") || "";
		let i = 0;
		const totalLength = Math.ceil(SVGPathCommander.getTotalLength(path));
		const moveDonor = () => {
			if (i >= totalLength) {
				return;
			}
			const point = SVGPathCommander.getPointAtLength(path, i);
			console.log  ()
			setPathData((prevPathData) =>
				`${prevPathData} ${point.x} ${point.y}`
			);
			i += 1;
			const speed = (100 - laserShow.speed);
			console.log (speed)
			if (laserShow.on) {
				timerID = setTimeout(moveDonor, speed);
			} else {
				clearTimeout( timerID )
				setPathData('M ')
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
