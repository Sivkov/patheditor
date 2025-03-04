import React, { useEffect } from "react";
import jointStore from "./stores/jointStore";
import { observer } from "mobx-react-lite";

const Joints = observer(() => {

	console.log ("New Joints DATA")

	const { jointPositions, joints} = jointStore
	console.log ( jointPositions )
	useEffect(() => {
		console.log("redraw joints");
	}, [joints]); 

	const getJointPath = (x, y) => {
		return `M${x} ${y} l2 2 -4 -4 2 2 2 -2 -4 4`;
	};

	return (
		<>
			{jointPositions.map((element, i) => ( 
				<g key={i} className="joint" fill="none">
					<path d={getJointPath(element.x, element.y)}></path>
				</g>
			))}
		</>
	);
});

export default Joints;
