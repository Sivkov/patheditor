import React from 'react';
 import Panel from './panel';
import '@fortawesome/fontawesome-free/css/all.css'
import svgStore from '../stores/svgStore';
import { observer } from 'mobx-react-lite';
import Util from '../../utils/util';


const PartPanel = observer(() => {

	const checkCollisions =()=> {
		console.log (' checkCollisions ')
	}

	const { svgData } = svgStore
	const panelInfo = [
		{
			id: 'partPopup',
			fa: (<><i class="fa-solid fa-gear me-2"></i><div>Part data</div></>),
			content: (
				<div className="d-flex">
					<table className="table">
						<tbody>
						{/*  TODO add or not ??	<tr>
								<td>id</td>
								<td>{svgData.params.id}</td>
 							</tr> */}
							<tr>
								<td>code</td>
								<td>{svgData.params.code}</td>
 							</tr>
							<tr>
								<td>uuid</td>
								<td id="info_uuid" contentEditable=""> {svgData.params.uuid}</td>
							</tr>
							<tr>
								<td>width</td>
 								<td>{Util.round (svgData.width, 3)}</td>
 							</tr>
							 <tr>
								<td>height</td>
 								<td>{ Util.round(svgData.height, 3)}</td>
 							</tr>
							<tr>
								<td colSpan={2}>
									<div className='d-flex align-items-center justify-content-around'>
										<button 
										className="btn btn-sm btn-danger btn_partDetectCollision"
										onMouseDown={ checkCollisions }
										>
											Check collision
										</button>								
										<div>
											<input id="ignoreColissions" type="checkbox" />Ignore contour collisions
										</div>										
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			),
		},
	]
	return (
		<>
			{panelInfo.map((element, index) => (
				<Panel key={'panel' + 55} element={element} index={55} />
			))}
		</>
	);
});

export default PartPanel;
