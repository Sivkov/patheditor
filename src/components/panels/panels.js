import React, { useState } from 'react';
import LogPanel from './logPanel';
import ToolsPanel from './toolsPanel';
import ContourPanel from './contourPanel';
import TecnologyPanel from './tecnologyPanel';
import PartPanel from './partPanel';
import InletPanel from './inletPanel';
import OutletPanel from './outletPanel';


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
		</>
	);
};

export default Panels;
