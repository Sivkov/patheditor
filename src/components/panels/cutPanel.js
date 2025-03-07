import Panel from './panel.js';
//import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
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
	const speed = () => { }
	const runCutQue = () => { }
	const stopCutQue = () => { }
	const [WH, setWH] = useState({w:100, h:100})


	const innerSort = useRef(null);
	const engSort = useRef(null);
	const inners = svgStore.getFiltered(["inner", "contour"]);
	const engs = svgStore.getFiltered('engraving', 'contour')


	useEffect(() => {
        if (!engSort.current) return;

        const sortable1 = new Sortable(engSort.current, {
            animation: 75,
            ghostClass: "sortable-ghost_item",
            dragClass: "sortable-drag_item",
            onEnd: (evt) => {
                //svgStore.reorderItems(evt.oldIndex, evt.newIndex); 
            },
        });

        return () => sortable1.destroy();
    }, [engs]); 



    useEffect(() => {
        if (!innerSort.current) return;

        const sortable = new Sortable(innerSort.current, {
            animation: 75,
            ghostClass: "sortable-ghost_item",
            dragClass: "sortable-drag_item",
            onEnd: (evt) => {
                //svgStore.reorderItems(evt.oldIndex, evt.newIndex); 
            },
        });

        return () => sortable.destroy();
    }, [inners]); 

	const resizeCutItem =(event)=> {
		//
		console.log ('resizeCutItem')
		let e = event.currentTarget;
		var newValueX, newValueY, svgX, svgY;
		if (e.classList.contains('w50')){
			newValueX = 50 
			newValueY = 50
			svgX=25 
			svgY=25;
		} else if (e.classList.contains('w100')) {
			newValueX = 100 
			newValueY = 100
			svgX=50
			svgY=50;
		} else {
			newValueX = (JSON.parse(localStorage.getItem('ppp'))?.cutPopup?.style?.width||500)-50
			newValueY =100
			svgX = newValueX
			svgY = 100
		}
        setWH({w:newValueX,h:newValueY})
		//root.style.setProperty('--sizeX', svgX);
		//root.style.setProperty('--sizeY', svgY);
	}

	const panelInfo =
	{
		id: 'cutPopup',
		fa: (<><i className="fa-solid fa-route me-2" /><div>{t('Cutting order')}</div></>),
		content: (
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
											onChange={speed}
										/>
									</div>
									<div className="ms-2">
										<button
											type="button"
											className="btn btn-sm btn-info"
											id="playCutPartOrder"
											onMouseDown={runCutQue}
										>
											<Icon icon="material-symbols:play-arrow-rounded" width="24" height="24" style={{ color: "white" }} />
										</button>
										<button
											type="button"
											className="btn btn-sm btn-danger ms-1"
											id="stopCutQue"
											onMouseDown={stopCutQue}
										>
											<Icon icon="material-symbols:stop-rounded" width="24" height="24" style={{ color: "white" }} />
										</button>
									</div>
									<div className="ms-2">
										<button
											type="button"
											className="btn btn-sm btn-primary w50 resizeCutItem"
											onMouseDown={resizeCutItem}
										>
											<Icon icon="material-symbols:grid-on-sharp" width="24" height="24" style={{ color: "white" }} />
										</button>
										<button
											type="button"
											className="btn btn-sm btn-primary w100 resizeCutItem"
											onMouseDown={resizeCutItem}
										>
											<Icon icon="material-symbols-light:grid-view" width="24" height="24" style={{ color: "white" }} />
										</button>
										<button
											type="button"
											className="btn btn-sm btn-primary resizeCutItem"
											onMouseDown={resizeCutItem}
										>
											<Icon icon="material-symbols-light:format-list-bulleted-rounded" width="24" height="24" />
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
												<div id="engravingSort" ref={engSort}>
												{engs.map((item, index) => (
													<div
													key={"S"+index} // или используйте уникальный идентификатор, например, item.id
													className="grid-square"
													style={{
													  width: `${WH?.w || 100}px`, 
													  height: `${WH?.h || 100}px`,
													}}
												  >
												{`XXXm ${index}`}
												  </div>
													
												))}
												</div>
											</div>
										</div>
										<div
											className="tab-pane active show "
											id="nav-inner"
											role="tabpanel"
											aria-labelledby="nav-inner-tab"
										>
											<div className="gridWrapper">
												<div id="innerSort" ref={innerSort}>
												{inners.map((item, index) => (
													<div
													key={index} // или используйте уникальный идентификатор, например, item.id
													className="grid-square"
													style={{
													  width: `${WH?.w || 100}px`, 
													  height: `${WH?.h || 100}px`,
													}}
												  >
												{`XXXm ${index}`}
												  </div>
													
												))}
												</div>
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



function updateSortableList() {
	document.querySelector('#innerSort').innerHTML = ''
	document.querySelector('#engravingSort').innerHTML = ''
	let contours = document.querySelectorAll('.contour[data-cid]:not(.outer)')
	contours.forEach(element => {
		let cid = +element.getAttribute('data-cid')
		let path = element.querySelector('path')
		let contourType = element.classList.contains('engraving') ? 'engraving' : 'inner'
		let cutlessElement = element.classList.contains('macro5')
		if (path) {
			let d = path.getAttribute('d')
			if (d) this.createCenteredSVGPath(d, cid, contourType, cutlessElement);
		}
	})

	var grid = document.getElementById('engravingSort');
	new Sortable(grid, {
		animation: 75,
		ghostClass: "sortable-ghost_item",
		dragClass: "sortable-drag_item",  // Class name for the dragging item
		onEnd: function () {
			//panels.sortAsQueque()
		},
	});

	var grid1 = document.getElementById('innerSort');
	new Sortable(grid1, {
		animation: 75,
		ghostClass: "sortable-ghost_item",
		dragClass: "sortable-drag_item",  // Class name for the dragging item
		onEnd: function () {
			//panels.sortAsQueque()
		},
	});
}

function createCenteredSVGPath(d, cid, contour = 'inner', cutlessElement) {
	console.log(arguments)
	var xmlns = "http://www.w3.org/2000/svg";
	let miniPath = document.createElementNS(xmlns, 'path');
	miniPath.setAttribute('d', d);

	let bbox = document.querySelector(`.contour[data-cid="${cid}"]`).getBBox();
	let minX = bbox.x;
	let minY = bbox.y;
	let width = bbox.width;
	let height = bbox.height;

	let svg = document.createElementNS(xmlns, 'svg');
	var root = document.documentElement;
	var rootStyles = getComputedStyle(root);
	var sizeX = rootStyles.getPropertyValue('--sizeX').trim();
	var sizeY = rootStyles.getPropertyValue('--sizeY').trim();

	svg.setAttribute('width', sizeX);
	svg.setAttribute('height', sizeY);

	if (contour === 'inner') {
		svg.setAttribute('fill', "#fd7e14");
	} else {
		svg.setAttribute('fill', "none");
		svg.setAttribute('stroke', "#fd7e14");
		svg.setAttribute('stroke-width', "1");
	}

	// Центрируем путь в SVG
	let scaleX = sizeX / width;
	let scaleY = sizeY / height;
	let scale = Math.min(scaleX, scaleY);

	// Рассчитываем новые координаты для центрирования и масштабирования
	let translateX = (sizeX - width * scale) / 2 - minX * scale;
	let translateY = (sizeY - height * scale) / 2 - minY * scale;


	miniPath.setAttribute('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
	svg.appendChild(miniPath);

	// Создаем элемент div и добавляем SVG внутрь него
	let div = document.createElement('div');
	div.setAttribute('class', `grid-square ${cutlessElement ? 'macro5' : ''}`);
	div.setAttribute('data-cid', cid);
	div.appendChild(svg);

	// Добавляем div в DOM
	/* if (contour === 'inner'){
		document.querySelector('#innerSort').appendChild(div);
	} else {
		document.querySelector('#engravingSort').appendChild(div);	
	} */
}