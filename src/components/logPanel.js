import { Icon } from '@iconify/react';
import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';  
import logStore from './logStore.js'; 
import svgStore from "./svgStore.js";
import { useEffect } from 'react';


const LogPanel = observer(() => {

	const handleRemoveLast = () => {
		console.log ('handleRemoveLast')
		svgStore.removeLastCodeElement(); 
		logStore.add ({time: new Date().getTime() ,action:'Contour deleted'})
	};

	useEffect(()=>{
		const interval = setInterval(() => {
			if (logStore.log.length > 0) {
 				const lastLog = logStore.log[logStore.log.length - 1];
				const currentTime = new Date().getTime();
	  
 				if (currentTime - lastLog.time > 30000) {
					logStore.add({ time: currentTime, action: "autosave" });
					console.log("Autosave added to logStore!");
				}
			} 
		  }, 10000);	  
		  return () => clearInterval(interval); // О
	},[logStore.log])

	const time = (t) => {
		const date = new Date(t); // Преобразуем t в объект Date
		const hours = date.getHours().toString().padStart(2, "0"); // Часы с ведущим нулем
		const minutes = date.getMinutes().toString().padStart(2, "0"); // Минуты с ведущим нулем
		const seconds = date.getSeconds().toString().padStart(2, "0"); // Секунды с ведущим нулем
	  
		return `${hours}:${minutes}:${seconds}`; // Возвращаем отформатированное время
	};

	const restore =()=>{
		console.log ('restore')
	}

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
				<div id="logger_wrapper" onClick={handleRemoveLast}>
				  <div id="logger">
					{logStore.log.map((element, index) => (					  

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
									<button type="button" className="btn btn-sm btn-primary mt-1 ms-2" onMouseDown={restore}>
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


 