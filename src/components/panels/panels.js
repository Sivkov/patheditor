import React, { useState } from 'react';
import LogPanel from './logPanel';
import ToolsPanel from './toolsPanel';
import ContourPanel from './contourPanel';
import TecnologyPanel from './tecnologyPanel';


const Panels =  () => {

	
	return (
		<>
			<LogPanel />
			<ToolsPanel />
			<ContourPanel />
			<TecnologyPanel />
		</>
	);
};

export default Panels;
