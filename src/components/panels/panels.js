import React from 'react';
import LogPanel from './logPanel';
import ToolsPanel from './toolsPanel';
import ContourPanel from './contourPanel';
import TecnologyPanel from './tecnologyPanel';
import PartPanel from './partPanel';
import InletPanel from './inletPanel';
import OutletPanel from './outletPanel';
import PointPanel from './pointPanel ';
import EdgePanel from './edgePanel';
import TextPanel from './textPanel';
import JointPanel from './jointPanel';

const Panels =  () => {

	return (
		<>
			<LogPanel />
			<ToolsPanel />
			<ContourPanel />
			<TecnologyPanel />
			<PartPanel />
			<InletPanel />
			<OutletPanel />
			<PointPanel />
			<EdgePanel />
			<TextPanel />
			<JointPanel />
		</>
	);
};

export default Panels;
