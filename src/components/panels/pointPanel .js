import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';
import svgStore from "../stores/svgStore.js";
import { useTranslation } from 'react-i18next';


const PointPanel = observer(() => {
	const { t } = useTranslation();
	const { selectedPointOnEdge } = svgStore;
	const applyPointPosition =()=>{}

	
	const panelInfo = [
		{
			id: "pointPopup",
			fa: (<><i className="fa-solid fa-location-dot me-2"></i><div>{t('Point')}</div></>),
			content: (<div className="d-flex flex-column">
			<table className="table mb-0">
			  <thead className="table-dark">
				<tr />
			  </thead>
			  <tbody>
				<tr id="pointParameters">
				  <td className="text-start ps-2">
					<div className="d-flex align-items-center justify-content-center">
					  <div className="d-flex align-items-center justify-content-around">
						<div className="d-flex align-items-center">
						  <input
							className="mx-2 popup_input "
							id="point_a"
							type="number"
							placeholder={0}
							min={1}
							max={360}
							step={1}
							disabled=""
							//defaultValue={ selectedPointOnEdge ? selectedPointOnEdge.angle : ''}
							value={ selectedPointOnEdge ? selectedPointOnEdge.angle : ''}
							onChange={()=>{}}
						  />
						  <div>°</div>
						</div>
						<div className="d-flex align-items-center ms-2">
						  <div>x</div>
						  <input
							className="mx-2 popup_input "
							id="point_x"
							type="number"
 							min={1}
							max={10000}
							step={1}
							//defaultValue={ selectedPointOnEdge ? selectedPointOnEdge.point.x : ''}
							value={ selectedPointOnEdge ? selectedPointOnEdge.point.x : ''}
							onChange={()=>{}}
						/>
						<div>{t('mm')}</div>
						</div>
						<div className="d-flex align-items-center ms-2">
						  <div className="">y</div>
						  <input
							className="mx-2 popup_input "
							id="point_y"
							type="number"
 							min={1}
							max={10000}
							step={1}
							//defaultValue={ selectedPointOnEdge ? selectedPointOnEdge.point.y : ''}
							value={ selectedPointOnEdge ? selectedPointOnEdge.point.y : ''}
							onChange={()=>{}}
						  />
						  <div>{t('mm')}</div>
						</div>
						<div className="d-flex align-items-center ms-2">
						  <div>
							<button
							  className="btn btn-secondary"
							  onMouseDown={ applyPointPosition }
							>
							  {t('Apply')}
							</button>
						  </div>
						</div>
					  </div>
					</div>
				  </td>
				</tr>
			  </tbody>
			</table>
		  </div>
		)
	}   
]

return (
		<>
			{selectedPointOnEdge &&  panelInfo.map((element, index) => (
				<Panel key={'panel' + index + 10} element={element} index={index + 10} />
			))}
		</>
	);
})


export default PointPanel