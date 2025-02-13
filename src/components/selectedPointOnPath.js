import React from 'react';
import { observer } from 'mobx-react-lite';
import svgStore from './stores/svgStore';


const SelectedPointOnPath = observer(() => {
	const {
		selectedPointOnPath
	} = svgStore

	if (!selectedPointOnPath) {
		return null;
	}

	return (
		<circle
			fill="green"
			r="1"
			strokeWidth="0.25"
			pointerEvents="all"
			cx={selectedPointOnPath.x}
			cy={selectedPointOnPath.y}
		/>
	);
});

export default SelectedPointOnPath;