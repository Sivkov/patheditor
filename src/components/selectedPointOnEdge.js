import React from 'react';
import { observer } from 'mobx-react-lite';
import svgStore from './stores/svgStore';
import Util from '../utils/util';


const SelectedPointOnEdge = observer(() => {
	const {
		selectedPointOnEdge
	} = svgStore

	if (!selectedPointOnEdge) {
		return null;
	}

	const onMouseUp =()=>{
		//addToLog("Contour was changed")
		svgStore.setBoundsList(false)
	}

	const onMouseDown =()=>{
		svgStore.setPointInMove(true)
		svgStore.setBoundsList (Util.createBoundsList())
	}

	return (
		<circle
			fill="red"
			r="1"
			strokeWidth="0.25"
			pointerEvents="all"
			cx={selectedPointOnEdge.point.x}
			cy={selectedPointOnEdge.point.y}
			onMouseDown = { onMouseDown }
			onMouseUp ={ onMouseUp }
		/>
	);
});

export default SelectedPointOnEdge;