import React from "react";
import svgStore from "./stores/svgStore";
import { observer } from "mobx-react-lite";
 

const Guides = observer(() => {
	const { xGuide, yGuide, aGuide, pointInMove } = svgStore

	if (!pointInMove) {
		return null;
	} 
 	

	return (
		<>
			{/* X-Гид (Вертикальная линия) */}
			<line
				x1={xGuide.x1}
				y1={xGuide.y1}
				x2={xGuide.x2}
				y2={xGuide.y2}
				stroke="white"
				strokeWidth="0.3"
				className="smartGuide"
				id="xGuide"
			/>

			{/* Y-Гид (Горизонтальная линия) */}
			<line
				x1={yGuide.x1}
				y1={yGuide.y1}
				x2={yGuide.x2}
				y2={yGuide.y2}
				stroke="white"
				strokeWidth="0.3"
				className="smartGuide"
				id="yGuide"
			/>

			{/* A-Гид (Дополнительная линия) */}
			<line
				x1={aGuide.x1}
				y1={aGuide.y1}
				x2={aGuide.x2}
				y2={aGuide.y2}
				stroke="white"
				strokeWidth="0.25"
				className="smartGuide"
				id="aGuide"
			/>
		</>
	);
});

export default Guides;
