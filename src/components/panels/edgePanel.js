import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';
import svgStore from "../stores/svgStore.js";
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import util from '../../utils/util.js';


const EdgePanel = observer(() => {
	const { selectedEdge, 
		selectedEdgePath } = svgStore
	const { t } = useTranslation();

 	const round = (val, n=3)=>{
		return (Math.round (val*10**n)) / 10**n
	}

	const [LL, setLL]= useState('')
	const [RX, setRX]= useState('')
	const [RY, setRY]= useState('')




	useEffect(()=>{
		console.log ('useEffedct selectedEdge')
		if (!selectedEdge) {
			setLL('')
			setRX('')
			setRY('')
			return
		}
		let normPath =  util.normPath ( selectedEdgePath )
		console.log (normPath )

		if (selectedEdgePath.includes('L')) {
			let dist =  util.distance( normPath[0][1], normPath[0][2],normPath[1][1],normPath[1][2])
			setLL (round (dist))
		}

		if (selectedEdgePath.includes('A')) {
			setRX( round (normPath[1][1]))
			setRY( round (normPath[1][2]))			
		}

	},[selectedEdge, selectedEdgePath ])
 
	const panelInfo = [
		{
			id: "edgePopup",
			fa: (<><Icon icon="gis:polyline-pt" width="24" height="24"  style={{color: "white" }} className='me-2'/><div>{t('Edge')}</div></>),
			content: (
				<>
				<div className="d-flex flex-column">
				{ selectedEdge && selectedEdgePath.includes('L') &&  <table className="table mb-0">
						<tbody>
								<tr id="edgeParameters">
									<td>
										<div className="d-flex align-items-center justify-content-center">
											<div className="d-flex align-items-center justify-content-around">
												<div>{t('Length')}:</div>
												<div>
													{ LL }
												</div>
												<div className='ms-1'>{t('mm')}</div>
												<div className="ms-2 d-none">{t('angle')}</div>
												<div></div>
												<button
													className="btn btn-secondary btn-sm to_arc ms-2"
													onMouseDown={() => { }}
												>
													{t('To arc')}
												</button>
											</div>
										</div>	
									</td>
								</tr>
						</tbody>
					</table>}
				
				{ selectedEdge &&  selectedEdgePath.includes('A') &&  <table className="table mb-0">
				  <tbody>
					<tr id="edgeParameters">
					  <td className="text-start ps-2">
						<div className="d-flex align-items-center justify-content-center">
						  <div className="d-flex align-items-center justify-content-around">
							<div className="d-flex align-items-center">
							  <div>rx</div>
							  <div>{RX} </div>							
							  <div>{t('mm')}</div>
							</div>
							<input
							  className="mx-2"
							  id="proportionRadius"
							  type="checkbox"
							  checked={true}
							  disabled
							  onChange={()=>{}}
							/>
							<div className="d-flex align-items-center">
							  <div className="">ry</div>
							  <div>{RY} </div>							
							  <div className="me-2">mm</div>
							  <div className="form-check form-switch ms-4 me-2">
								<input
								  className="form-check-input"
								  type="checkbox"
								  id="arcFlag2"
								  //onchange="edge.arcFlag(this)"
								/>
							  </div>
							  <div className="form-check form-switch mx-2">
								<input
								  className="form-check-input"
								  type="checkbox"
								  id="arcFlag3"
								  //onchange="edge.arcFlag(this)"
								/>
							  </div>
							</div>
							<div className="ms-2 d-none">Угол</div>
							<input
							  className="mx-2 popup_input d-none"
							  id="edge_angle"
							  type="number"
							  placeholder={1}
							  min={1}
							  max={10000}
							  step={1}
							/>
							<div>
							  <div className="d-flex">
								<button className="btn btn-sm btn-secondary">{t('Apply')}</button>
							  </div>
							</div>
						  </div>
						</div>
						<div className="d-flex align-items-center justify-content-center">
						  <div className="d-flex align-items-center justify-content-around">
							<div style={{ marginRight: 28 }}>Save points</div>
							<div className="form-check form-switch mx-2">
							  <input
								className="form-check-input"
								type="checkbox"
								id="arcPrioritySwitcher"
							  />
							</div>
							<div>{t('Save arc angle')}</div>
						  </div>
						  <div>
							<button
							  className="btn btn-secondary btn-sm to_line ms-2"
							  //onmousedown="edge.convertToThis(this)"
							>
							  {t('To line')}
							</button>
						  </div>
						</div>
					  </td>
					</tr>
				  </tbody>
				</table>}
			  </div>
			</>
			)
		}
	]

	return (
		<>
			{ selectedEdge && panelInfo.map((element, index) => (
				<Panel key={'panel' + index + 11} element={element} index={index + 11} />
			))}
		</>
	);
})


export default EdgePanel;