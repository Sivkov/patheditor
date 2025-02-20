import React from 'react';
import { observer } from 'mobx-react-lite';
import svgStore from './stores/svgStore';


const SelectedEdge = observer(() => {
	const {
		selectedEdgePath,
	} = svgStore

	const onMouseUp =()=>{		 
	}

	const onMouseDown =()=>{
	}

	return (
		<path
			d={selectedEdgePath}
			id="selectedEdge"
		/>

	);
});

export default SelectedEdge;