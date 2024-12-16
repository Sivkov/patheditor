import { Icon } from '@iconify/react';
import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';  
import logStore from './logStore.js'; 
import svgStore from "./svgStore.js";
import { useEffect, useState } from 'react';
import log from './../scripts/log.js'


const LogPanel = observer(() => {

	const handleRemoveLast = () => {
		console.log ('handleRemoveLast')
		svgStore.removeLastCodeElement(); 
		let now = new Date().getTime()
		logStore.add ({time: now ,action:'Contour deleted'})
		let data = {
			id: now,
			svg: JSON.stringify(svgStore.svgData)
		}
		log.save(data)
	};

	useEffect(() => {
		log.initDatabase()
			.then(() => {
				console.log('Database initialized.');	
				let now = new Date().getTime();
				logStore.add({ time: now, action: 'Ready to work' });
	
				let data = {
					id: now,
					svg: JSON.stringify(svgStore.svgData),
				};
	
				log.save(data);
				console.log('Data saved to IndexedDB.');
			})
			.catch((error) => {
				console.error('Error initializing database or saving data:', error);
			});
	}, []);
	
	const time = (t) => {
		const date = new Date(t);
		const hours = date.getHours().toString().padStart(2, "0"); 
		const minutes = date.getMinutes().toString().padStart(2, "0");
		const seconds = date.getSeconds().toString().padStart(2, "0");
	  	return `${hours}:${minutes}:${seconds}`;
	};

	const restore = async (e) => {
		try {
			const tpoint = Number(e.currentTarget.getAttribute('data-stamp'));
			console.log('Restore from', tpoint);
			const data = await log.load(tpoint);	
 			console.log('Loaded data:', data);
			let parsed = JSON.parse(data.svg)
			if (parsed ) {
				const newSvgData = {
					width: parsed.width,
					height: parsed.height,
					code: parsed.code,
				  };
				svgStore.setSvgData(newSvgData)
			}		
			logStore.makeNoteActive(tpoint)	
			
		} catch (error) {
			console.error('Error during restore:', error);
		}
	};

	const panelInfo = [
		  {
			id: 'logPopup',
			fa: (<Icon icon="vaadin:time-backward" width="24" height="24"  style={{color: 'white'}} />),
			mini: false,
			style: {
				top: 40,
				left: 12,
				width: 350,
				height:100,
			  },
			  content: (
				<div id="logger_wrapper">
				<button onMouseDown={handleRemoveLast}>Button</button>
				  <div id="logger">
					{logStore.log.map((element, index, arr) => (					  

						<div key={index+'logger'} className="log_mess"  data-stamp={ element.time } >
							<div className="d-flex justify-content-between pt-2">
								<div className="d-flex">
									<div className="messTime ms-2">
										<h6>{time(element.time)}</h6>
									</div>
									<div className="ms-2">
										<h6 className="text-white">{element.action}</h6>
									</div>
								</div>
								<div className="me-4">
									<button type="button" className={ element.active ? 
									'btn btn-sm mt-1 ms-2 btn-secondary btn-log-restore active' : 
									'btn btn-sm mt-1 ms-2 btn-secondary btn-log-restore'} 
									data-stamp={ element.time } 
									onMouseDown={restore}>
									Restore
								</button>
								</div>                
							</div>              
							<div className="custom_devide mt-2"></div>
						</div>

					))}
				  </div>
				</div>
			  ),
		},    
	]
return (
	<>
		{panelInfo.map((element, index) => (
			<Panel key={'panel' + index} element={element} index={index} />
		))}
	</>
	);
})

export default LogPanel;


 