import { Icon } from '@iconify/react';
import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';
import logStore from '../stores/logStore.js';
import svgStore from "../stores/svgStore.js";
import { useEffect, useState } from 'react';
import log from './../../scripts/log.js'
import Hook from './../../img/Hook.jpg';
import Direct from './../../img/Direct.jpg';
import Straight from './../../img/Straight.jpg';
import Tangent from './../../img/Tangent.jpg';
import SVGPathCommander from 'svg-path-commander';
import inlet from '../../scripts/inlet.js';
import util from '../../utils/util.js';


const OutletPanel = observer(() => {

	const {
		selectedCid,
		selectedPath,
		selectedOutletPath
	} = svgStore;

	const [type, setType] = useState(Straight)
	const [mode, setMode] = useState(null)
	const [TangentL, setTangentL] = useState(0);
	const [TangentR, setTangentR] = useState(0);
	const [HookL, setHookL] = useState(0);
	const [HookR, setHookR] = useState(0);
	const [DirectA, setDirectA] = useState(90);
	const [DirectL, setDirectL] = useState(0);

	useEffect(() => {
		let outletMode = inlet.detectInletType ( selectedOutletPath )
		setType(outletMode)
 	}, [ selectedOutletPath, selectedCid])

	 useEffect(() => {
		let mode = inlet.detectInletType ( selectedOutletPath )
		setOutletParams(mode)
	}, [ selectedCid, mode])

	 useEffect(()=>{
		let resp;
		if (DirectL && selectedOutletPath) {
			resp = inlet.outletDirectL (DirectL, selectedOutletPath)
			if ( resp && SVGPathCommander.isValidPath( resp.newOutletPath ) ) {
				svgStore.updateElementValue ( selectedCid, 'outlet', 'path', resp.newOutletPath )
			} else {
				console.log ('Invalid PATH')
			}
		}		
	},[DirectL])


	useEffect(()=>{
		let resp;
		if (DirectA && selectedOutletPath) {
			let classes = svgStore.getElementByCidAndClass ( selectedCid, 'contour', 'class')
			let contourType = classes.includes('inner') ? 'inner' : 'outer'
			resp = inlet.outletDirectA (DirectA, selectedOutletPath, selectedPath, contourType)
			if ( resp && SVGPathCommander.isValidPath( resp.newOutletPath ) ) {
				svgStore.updateElementValue ( selectedCid, 'outlet', 'path', resp.newOutletPath )
			}
		}		
	},[DirectA])

	useEffect(()=>{
		let resp;
		if (TangentR && TangentL  && selectedOutletPath) {
			resp = inlet.outletTangentR (TangentR, TangentL, selectedOutletPath)
			if ( resp && SVGPathCommander.isValidPath( resp.newOutletPath ) ) {
				svgStore.updateElementValue ( selectedCid, 'outlet', 'path', resp.newOutletPath )
			} else {
				console.log ('Invalid PATH')
			}
		}		
	},[TangentR])

	useEffect(()=>{
		let resp;
		if (TangentR && TangentL  && selectedOutletPath) {
			resp = inlet.outletTangentL (TangentL, selectedOutletPath)
			if ( resp && SVGPathCommander.isValidPath( resp.newOutletPath ) ) {
				svgStore.updateElementValue ( selectedCid, 'outlet', 'path', resp.newOutletPath )
			} else {
				console.log ('Invalid PATH')
			}
		}		
	},[TangentL])
	
	useEffect(()=>{
		let resp;
		if (HookR &&  HookL && selectedOutletPath) {
			resp = inlet.outletHookR (HookR, HookL, selectedOutletPath)
			if (resp && SVGPathCommander.isValidPath( resp.newOutletPath ) ) {
					svgStore.updateElementValue ( selectedCid, 'outlet', 'path', resp.newOutletPath )
				} else {
					console.log ('Invalid PATH')
			}				
		}		
	},[HookR])

	useEffect(()=>{
		let resp;
		if (HookR &&  HookL && selectedOutletPath) {
			resp = inlet.outletHookL (HookL, HookR, selectedOutletPath)
			if ( resp &&  SVGPathCommander.isValidPath( resp.newOutletPath ) ) {
				svgStore.updateElementValue ( selectedCid, 'outlet', 'path', resp.newOutletPath )
			} else {
				console.log ('Invalid PATH')
			}				
			
		}		
	},[HookL])


	const setNewOutlet = (newType) =>{
		console.log(newType)
		if (type === newType) return;
		let classes = svgStore.getElementByCidAndClass ( selectedCid, 'contour', 'class')
		let contourType = classes.includes('inner') ? 'inner' : 'outer'	
		let resp = inlet.setOutletType (newType, false, 'set', selectedPath, selectedOutletPath, contourType)
		if (resp && resp.newOutletPath && resp.newOutletPath.length) {
			svgStore.updateElementValue ( selectedCid, 'outlet', 'path', resp.newOutletPath )
			addToLog( 'Set outlet type')
			setOutletParams ()
		}
	}

	const setOutletForAll = () =>{
		console.log ('setoutletForAll')
		let mode = inlet.detectInletType ( selectedOutletPath )
		let outlets = svgStore.getFiltered("outlet")
		if (mode) {
			for (let i in  outlets ) {
				let element = outlets[i]
				let contourType = element.class.includes('inner') ? 'inner' : 'outer'	
				let outletPath = element.path
				let contour = svgStore.getElementByCidAndClass ( element.cid, 'contour')

				let resp = inlet.setOutletType (mode, false, 'set', contour.path, outletPath, contourType)
				if (resp && resp.newOutletPath && resp.newOutletPath.length) {
					svgStore.updateElementValue ( element.cid, 'outlet', 'path', resp.newOutletPath )
					setOutletParams ()
				}
			}
			addToLog(`Set outlet type ${mode} for all`)
		}
	}

	const addToLog =(mess)=> {
		let now = new Date().getTime()
		logStore.add ({time: now ,action: mess})
		let data = {
			id: now,
			svg: JSON.stringify(svgStore.svgData)
		}
		log.save(data)	
	}	

	const setOutletParams = (mode) => {
		if (mode === 'Tangent') {
            let R;
            let path =  SVGPathCommander.normalizePath(selectedOutletPath)
            path.forEach((seg)=>{
                if (seg[0] === "A" ) {
                    R=seg[1]
                }
            })
            setTangentR(R)
            let L =  util.arcLength(selectedOutletPath)//Math.round(util.arcLength(selectedOutletPath)*1000)/1000
            setTangentL(L)
        } else if (mode === 'Direct') {
          
            let A, MX, MY, LX, LY, D, PX, PY;
            let path =  SVGPathCommander.normalizePath(selectedOutletPath)
            if (path && path.length) {
                path.forEach( seg=>{
                    if ( seg.includes('M')) {
                        LX=seg[1]
                        LY=seg[2]
                    }
                    if ( seg.includes('L')) {
                        MX=seg[1]
                        MY=seg[2]    
                    }
                }) 
            }

            let contour =  SVGPathCommander.normalizePath(selectedPath)
            contour.forEach((seg, i)=>{
                if (i<2){
                    if (seg.includes('M')) {
                        PX=seg[1]
                        PY=seg[2]
                    } else if ( seg.includes('L')) {
                        PX=seg[1]
                        PY=seg[2]    
                    } else if (seg.includes('A')) {
                        PX=seg[6]
                        PY=seg[7]
                    }
                }
            })

            A = Math.round(util.calculateAngleVector ( LX, LY, MX, MY, PX, PY)*100)/100
            D = util.distance( MX, MY, LX, LY )

            if (contour[1][0] === 'A' ) {
                let nearestSegment = contour[1]
                const rx = parseFloat(nearestSegment[1]);
                const ry = parseFloat(nearestSegment[2]);
                const flag1 = parseFloat(nearestSegment[3]);
                const flag2 = parseFloat(nearestSegment[4]);
                const flag3 = parseFloat(nearestSegment[5]);
                const EX = parseFloat(nearestSegment[6]);
                const EY = parseFloat(nearestSegment[7]);
                let C = util.svgArcToCenterParam (LX, LY, rx, ry, flag1, flag2, flag3, EX, EY, true)   
                let OP = util.rotatePoint(C.x, C.y,  LX, LY,0, 270)
                A = Math.round(util.calculateAngleVector ( LX, LY, MX, MY, OP.x, OP.y)*100)/100
                if (rx !== ry) {
                    console.log( 'rx !=== ry' )
                }
            }

            setDirectA(A)
            setDirectL(D)

        } else if (mode === 'Hook') {

            let MX, MY, LX, LY, R, D;
            let path =  SVGPathCommander.normalizePath(selectedOutletPath)
            if (path.length) {
                path.forEach( seg=>{
                    if ( seg.includes('M')) {
                        MX=seg[1]
                        MY=seg[2]
                    } else if ( seg.includes('L')) {
                        LX=seg[1]
                        LY=seg[2]    
                    } else if (seg.includes('A')){
                        R=seg[1]
                    }
                }) 
            }
            D = util.round( util.distance( MX, MY, LX, LY ), 3)
            setHookR(R)
            setHookL(D)
        }
	} 



	const panelInfo = [
		  {
			id: 'outletPopup',
			fa: (<><Icon icon="ion:exit-outline" width="24" height="24" style={{color: 'white'}} className='me-2' /><div>Outlet</div></>),
			content:  (
				<div className="d-flex flex-column">
					<table className="table mb-0">
						<tbody>
{/* 							<tr>
								<td colSpan={3}>
									<div className="d-flex align-items-center ms-4 justify-content-around">
										<div className="d-flex align-items-center">
											<div>
												<i className="fa-solid fa-arrows-left-right-to-line" />
											</div>
											<input
												className="mx-2"
												id="outletIntend"
												type="number"
												placeholder={2}
												min={1}
												max={5}
												step={1}
												defaultValue={2}
											/>
											<div>mm</div>
										</div>
										<div className="ms-2">
											<button className="btn btn-sm btn-primary btn_ShowDangerOutlets">
												Show danger outlets
											</button>
										</div>
									</div>
								</td>
							</tr> */}
							<tr>
								<td colSpan={3} className='d-flex justify-content-around'>
									<div className="d-flex">
										<input
											className="form-check-input mt-0 outletMode"
											type="radio"
											name="outletMode"
											id="outletModeSet"
											onMouseDown={() => { setMode('set') }}
											checked={mode === 'set'}
										/>
										<label className="form-check-label mx-1" htmlFor="outletModeSet">
											Set
										</label>
									</div>
									<div className="d-flex">
										<input
											className="form-check-input mt-0 outletMode"
											type="radio"
											name="outletMode"
											id="outletModeEdit"
											onMouseDown={() => { setMode('edit') }}
											checked={mode === 'edit'}

										/>
										<label className="form-check-label mx-1" htmlFor="outletModeEdit">
											Edit
										</label>
									</div>									
								</td>
							</tr>

						</tbody>
					</table>
					<table className="table">
						<tbody>
							<tr>
								<td className="w-50">
									<div className="form-check text-left ms-4">
										<input
											className="form-check-input mt-0 mt-0 inputOutletType"
											type="radio"
											name="outletType"
											id="outletTypeStraight"
											disabled={mode !== 'set'}
											checked={type === 'Straight'}
											onMouseDown={()=>{ setNewOutlet('Straight')}}
										/>
										<label className="form-check-label mx-1" htmlFor="outletTypeStraight">
											<div>
												Straight
											</div>
										</label>
									</div>
									<div className="form-check text-left ms-4">
										<input
											className="form-check-input mt-0 inputOutletType"
											type="radio"
											name="outletType"
											id="outletTypeDirect"
											disabled={mode !== 'set'}
											checked={type === 'Direct'}
											onMouseDown={()=>{ setNewOutlet('Direct')}}
										/>
										<label className="form-check-label mx-1" htmlFor="outletTypeDirect">
											<div>
												Direct
											</div>
										</label>
									</div>
									<div className="form-check text-left ms-4">
										<input
											className="form-check-input mt-0 inputOutletType"
											type="radio"
											name="outletType"
											id="outletTypeHook"
											disabled={mode !== 'set'}
											checked={type === 'Hook'}
											onMouseDown={()=>{ setNewOutlet('Hook')}}

										/>
										<label className="form-check-label mx-1" htmlFor="outletTypeHook">
											<div>
												Hook
											</div>
										</label>
									</div>
									<div className="form-check text-left ms-4">
										<input
											className="form-check-input mt-0 inputOutletType"
											type="radio"
											name="outletType"
											id="outletTypeTangent"
											disabled={mode !== 'set'}
											checked={type === 'Tangent'}
											onMouseDown={()=>{ setNewOutlet('Tangent')}}
										/>
										<label className="form-check-label mx-1" htmlFor="outletTypeTangent">
											<div>
												Tangent
											</div>
										</label>
									</div>
								</td>
								<td colSpan={2}>
									<div id="outlet_viewer__wrapper">
										<img id="outlet_viewer__wrapper__img" src={
											type === "Straight" ? Straight :
												type === "Hook" ? Hook :
													type === "Direct" ? Direct :
														type === "Tangent" ? Tangent : ''
										}
										alt="pic"/>
									</div>
								</td>
							</tr>
							<tr>
								<td colSpan={2}>
									<div className="d-flex ms-3">
										<button
											className="btn btn-sm btn-primary btn_outletApplyForAll"
											id="outletApplyForAll"
											onMouseDown={()=>{ setOutletForAll()}}
										>
											Apply for all
										</button>
									</div>
								</td>
							</tr>
							<tr>
								<td colSpan={2} id="outletParams" >
									{
										(type === "Straight" && mode === 'edit') ? ('') :
											(type === "Hook" && mode === 'edit') ? (
												<div className="d-flex flex-column">
													<div className="d-flex justify-content-center">
														<div className="d-flex align-items-center">															<div className="mr-2">
															<div className='popup_input_label'>r</div>
														</div>
															<div>
																<input
																	className="popup_input mx-2"
																	type="number"
																	min="0.1"
																	id="outletHookR"
																	step="0.05"
																	value={HookR}
																	onChange={(e) => setHookR(parseFloat(e.target.value))}
																/>
															</div>
															<div className="ml-2">
																<div className='popup_input_label'>mm</div>
															</div>
														</div>
													</div>
													<div className="d-flex justify-content-center">
														<div className="d-flex align-items-center">															<div className="mr-2">
															<div className='popup_input_label'>d</div>
														</div>
															<div>
															<input
																className="popup_input mx-2"
																type="number"
																min="0.1"
																id="outletHookL"
																step="0.1"
																value={HookL}
																onChange={(e) => setHookL(parseFloat(e.target.value))}
															/>
															</div>
															<div className="ml-2">
																<div className='popup_input_label'>mm</div>
															</div>
														</div>
													</div>
												</div>

											) :
												(type === "Direct"  && mode === 'edit' )? (
													<div className="d-flex flex-column">
														<div className="d-flex justify-content-center">
															<div className="d-flex align-items-center">																<div className="mr-2">
																<div className='popup_input_label'>l</div>
															</div>
																<div>
																	<input
																		className="popup_input mx-2"
																		type="number"
																		min="0.1"
																		id="outletDirectL"
																		step="0.1"
																		onChange={(e) => setDirectL(parseFloat(e.target.value))}
																		value={ Math.round( DirectL *1000)/1000}
																	/>
																</div>
																<div className="ml-2">
																	<div className='popup_input_label'>mm</div>
																</div>
															</div>
														</div>
														<div className="d-flex justify-content-center">
															<div className="d-flex align-items-center">																<div className="mr-2">
																<div className='popup_input_label'>a</div>
															</div>
																<div>
																<input
																	className="popup_input mx-2"
																	type="number"
																	id="outletDirectA"
																	step={1}
																	min={0}
																	/* max={180} */
																	onChange={(e) => setDirectA(parseFloat(e.target.value))}
																	value={DirectA}
																/>
																</div>
																<div className="ml-2">
																	<div className='popup_input_label'>deg</div>
																</div>
															</div>
														</div>
													</div>) :
													(type === "Tangent" && mode === 'edit')  ? (
													<div className="d-flex flex-column">
														<div className="d-flex justify-content-center">
															<div className="d-flex align-items-center">																<div className="mr-2">
																<div className='popup_input_label'>r</div>
															</div>
																<div>
																	<input
																		className="popup_input mx-2"
																		type="number"
																		min={0.1}
																		id="outletTangentR"
																		step={0.1}
																		onChange={(e) => setTangentR(parseFloat(e.target.value))}
																		value={TangentR}
																	/>
																</div>
																<div className="ml-2">
																	<div className='popup_input_label'>mm</div>
																</div>
															</div>
														</div>
														<div className="d-flex justify-content-center">
															<div className="d-flex align-items-center">																<div className="mr-2">
																<div className='popup_input_label'>l</div>
															</div>
																<div>
																	<input
																		className="popup_input mx-2"
																		type="number"
																		min={0.1}
																		id="outletTangentL"
																		step={0.1}
																		onChange={(e) => setTangentL(parseFloat(e.target.value))}
																		//onInput={(e) => setTangentL(parseFloat(e.target.value))}
																		value={ Math.round(TangentL*1000)/1000 }
																	/>
																</div>
																<div className="ml-2">
																	<div className='popup_input_label'>mm</div>
																</div>
															</div>
														</div>
													</div>) : ''
									}
								</td>
							</tr>
						</tbody>
					</table>
				</div>)
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