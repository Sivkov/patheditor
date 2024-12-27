import React, { useState } from 'react';
import LogPanel from './logPanel';
import ToolsPanel from './toolsPanel';
import ContourPanel from './contourPanel';
import TecnologyPanel from './tecnologyPanel';
import PartPanel from './partPanel';


const Panels =  () => {

	
	return (
		<>
			<LogPanel />
			<ToolsPanel />
			<ContourPanel />
			<TecnologyPanel />
			<PartPanel />
		</>
	);
};

export default Panels;
