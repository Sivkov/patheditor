import React from 'react';
import { observer } from 'mobx-react-lite';
import svgStore from './stores/svgStore';


const SelectedPointOnEdge = observer(() => {
	const {
		selectedPointOnEdge
	} = svgStore

	if (!selectedPointOnEdge) {
		return null;
	}

	return (
		<circle
			fill="red"
			r="1"
			strokeWidth="0.25"
			pointerEvents="all"
			cx={selectedPointOnEdge.point.x}
			cy={selectedPointOnEdge.point.y}
		/>
	);
});

export default SelectedPointOnEdge;