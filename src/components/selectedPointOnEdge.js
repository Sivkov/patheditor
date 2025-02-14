import React from 'react';
import { observer } from 'mobx-react-lite';
import svgStore from './stores/svgStore';
import { addToLog } from '../scripts/addToLog';


const SelectedPointOnEdge = observer(() => {
	const {
		selectedPointOnEdge
	} = svgStore

	if (!selectedPointOnEdge) {
		return null;
	}

	const onMouseUp =()=>{
		svgStore.setPointInMove(false)
		addToLog("Contour was changed")
	}

	return (
		<circle
			fill="red"
			r="1"
			strokeWidth="0.25"
			pointerEvents="all"
			cx={selectedPointOnEdge.point.x}
			cy={selectedPointOnEdge.point.y}
			onMouseDown = {()=> svgStore.setPointInMove(true)}
			onMouseUp ={ onMouseUp }
		/>
	);
});

export default SelectedPointOnEdge;