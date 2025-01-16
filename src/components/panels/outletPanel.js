import { Icon } from '@iconify/react';
import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';  
import logStore from '../stores/logStore.js'; 
import svgStore from "../stores/svgStore.js";
import { useEffect, useState } from 'react';
import log from './../../scripts/log.js'


const OutletPanel = observer(() => {


	const panelInfo = [
		  {
			id: 'outletPopup',
			fa: (<><Icon icon="ion:exit-outline" width="24" height="24" style={{color: 'white'}} className='me-2' /><div>Outlet</div></>),
			content: (
				<div>
				 Outlet
				</div>
			  ),
		},    
	]
return (
	<>
		{panelInfo.map((element) => (
			<Panel key={'panel' + 5} element={element} index={5} />
		))}
	</>
	);
})

export default OutletPanel;