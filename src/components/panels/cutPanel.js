import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import util from '../../utils/util.js';
//import { addToLog } from './../../scripts/addToLog.js';
import { useTranslation } from 'react-i18next';
import CONSTANTS from '../../constants/constants.js';
import { addToLog } from '../../scripts/addToLog.js';
import jointStore from '../stores/jointStore.js';
import svgStore from '../stores/svgStore.js';
import { Icon } from '@iconify/react';
import Sortable from 'sortablejs';



const CutPanel = observer(() => {
	
	const { t } = useTranslation();
	const speed =()=>{}
	const runCutQue =()=>{}
	const stopCutQue =()=>{}
	const resizeCutItem =()=>{}
	const {

	} = svgStore
		
	const panelInfo = 
		  {
		id: 'cutPopup',
			fa: (<><i className="fa-solid fa-route me-2" /><div>{t('Cutting order')}</div></>),
			content:  (
<div className="d-flex flex-column">
	<table className="table">
		<tbody>
		<tr>
			<td>
			<div className="d-flex align-items-center justify-content-evenly">
				<div className="ms-2 w-25">
				<input
					type="range"
					className="form-range"
					id="speedPartShow"
					step={1}
					min={1}
					max={100}
					defaultValue={50}
					onChange={ speed }
				/>
				</div>
				<div className="ms-2">
				<button
					type="button"
					className="btn btn-sm btn-info"
					id="playCutPartOrder"
					onMouseDown={ runCutQue }
				>
					<i className="fa-solid fa-play" />
				</button>
				<button
					type="button"
					className="btn btn-sm btn-danger"
					id="stopCutQue"
					onMouseDown= { stopCutQue }
				>
					<i className="fa-solid fa-stop" />
				</button>
				</div>
				<div className="ms-2">
				<button
					type="button"
					className="btn btn-sm btn-primary w50 resizeCutItem"
					onMouseDown = { resizeCutItem }
				>
					<Icon icon="material-symbols:grid-on-sharp" width="24" height="24"  style={{color: "white"}} />
				</button>
				<button
					type="button"
					className="btn btn-sm btn-primary w100 resizeCutItem"
					onMouseDown = { resizeCutItem }
				>
					<Icon icon="material-symbols-light:grid-view" width="24" height="24"  style={{color: "white"}} />
				</button>
				<button
					type="button"
					className="btn btn-sm btn-primary resizeCutItem"
					onMouseDown = { resizeCutItem }
				>
					<i className="fa-solid fa-list" />
				</button>
				</div>
			</div>
			</td>
		</tr>
		<tr>
			<td>
			<div className="d-flex flex-column" id="editCutPartSquare" />
			</td>
		</tr>
		<tr>
			<td>
			<div className="d-flex flex-column" id="cutPartModel" />
			<div className="">
				<nav>
				<div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
					<button
					className="nav-link "
					id="nav-engraving-tab"
					data-bs-toggle="tab"
					data-bs-target="#nav-engraving"
					type="button"
					role="tab"
					aria-controls="nav-engraving"
					aria-selected="false"
					tabIndex={-1}
					>
					{t('Engraving')}
					</button>
					<button
					className="nav-link active"
					id="nav-inner-tab"
					data-bs-toggle="tab"
					data-bs-target="#nav-inner"
					type="button"
					role="tab"
					aria-controls="nav-inner"
					aria-selected="false"
					tabIndex={-1}
					>
					{t('Inner')}
					</button>
				</div>
				</nav>
				<div className="tab-content p-3" id="nav-tabContent">
				<div
					className="tab-pane fade"
					id="nav-engraving"
					role="tabpanel"
					aria-labelledby="nav-engraving-tab"
				>
					<div className="gridWrapper">
					<div id="engravingSort"></div>
					 ПИЗДА 
					</div>
				</div>
				<div
					className="tab-pane active show "
					id="nav-inner"
					role="tabpanel"
					aria-labelledby="nav-inner-tab"
				>
					<div className="gridWrapper">
					<div id="innerSort"></div>
					 ХУЙ 
					</div>
				</div>
				</div>
			</div>
			</td>
		</tr>
		</tbody>
	</table>
</div>)
}    
	
return (
	<>
		<Panel key={'panel' + 14} element={panelInfo} index={14} />
	</>
	);
})

export default CutPanel;