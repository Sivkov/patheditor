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


const InletPanel = observer(() => {

	const {
		selected,
		selectedCid,
		selectedPath,
		selectedInletPath
	} = svgStore;

	const [type, setType] = useState(Straight)
	const [mode, setMode] = useState(null)


	useEffect(() => {
		let inletMode = 'Straight'
		if (selectedInletPath) {
			let path = SVGPathCommander.normalizePath(selectedInletPath).map(a => a.join(' ')).join(' ')
			if (path && path.length) {
				if (path.includes('L') || path.includes('H') || path.includes('V')) {
					inletMode = 'Direct'
					if (path.includes('A')) {
						inletMode = 'Hook'
					}
					/*                     
					// пока рисуем треугольник определяем так
					if (path.match(/L/g) && path.match(/L/gm).length && path.match(/L/gm).length === 3) {
					inletMode= Straight      
					} */
				} else if (path.includes('A')) {
					inletMode = 'Tangent'
				}
			}
		}

		setType(inletMode)
	}, [selectedInletPath, selectedCid])

	const panelInfo = [
		{
			id: 'inletPopup',
			fa: (<>
				<Icon icon="ion:enter-outline" width="24" height="24" style={{ color: 'white' }} className='me-2' /><div>Inlet</div></>),
			content: (
				<div className="d-flex flex-column">
					<table className="table mb-0">
						<tbody>
							<tr>
								<td colSpan={3}>
									<div className="ms-4 d-flex">
										<input id="preventDangerInlets" className="" type="checkbox" />
										<label
											className="form-check-label ms-2"
											htmlFor="preventDangerInlets"
										>
											Prevent danger inlets
										</label>
									</div>
								</td>
							</tr>
							<tr>
								<td colSpan={3}>
									<div className="d-flex align-items-center ms-4 justify-content-around">
										<div className="d-flex align-items-center">
											<div>
												<i className="fa-solid fa-arrows-left-right-to-line" />
											</div>
											<input
												className="mx-2"
												id="inletIntend"
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
											<button className="btn btn-sm btn-primary btn_ShowDangerInlets">
												Show danger inlets
											</button>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td colSpan={3} className='d-flex justify-content-around'>
									<div className="d-flex">
										<input
											className="form-check-input mt-0 inletMode"
											type="radio"
											name="inletMode"
											id="inletModeSet"
											onMouseDown={() => { setMode('set') }}
										/>
										<label className="form-check-label mx-1" htmlFor="inletModeSet">
											Set
										</label>
									</div>
									<div className="d-flex">
										<input
											className="form-check-input mt-0 inletMode"
											type="radio"
											name="inletMode"
											id="inletModeEdit"
											onMouseDown={() => { setMode('edit') }}
										/>
										<label className="form-check-label mx-1" htmlFor="inletModeEdit">
											Edit
										</label>
									</div>
									<div className="d-flex">
										<input
											className="form-check-input mt-0 inletMode"
											type="radio"
											name="inletMode"
											id="inletModeMove"
											onMouseDown={() => { setMode('move') }}
										/>
										<label className="form-check-label mx-1" htmlFor="inletModeMove">
											Move
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
											className="form-check-input mt-0 mt-0 inputInletType"
											type="radio"
											name="inletType"
											id="inletTypeStraight"
											disabled={mode !== 'set'}
											checked={type === 'Straight'}
										/>
										<label className="form-check-label mx-1" htmlFor="inletTypeStraight">
											<div>
												Straight
											</div>
										</label>
									</div>
									<div className="form-check text-left ms-4">
										<input
											className="form-check-input mt-0 inputInletType"
											type="radio"
											name="inletType"
											id="inletTypeDirect"
											disabled={mode !== 'set'}
											checked={type === 'Direct'}

										/>
										<label className="form-check-label mx-1" htmlFor="inletTypeDirect">
											<div>
												Direct
											</div>
										</label>
									</div>
									<div className="form-check text-left ms-4">
										<input
											className="form-check-input mt-0 inputInletType"
											type="radio"
											name="inletType"
											id="inletTypeHook"
											disabled={mode !== 'set'}
											checked={type === 'Hook'}
										/>
										<label className="form-check-label mx-1" htmlFor="inletTypeHook">
											<div>
												Hook
											</div>
										</label>
									</div>
									<div className="form-check text-left ms-4">
										<input
											className="form-check-input mt-0 inputInletType"
											type="radio"
											name="inletType"
											id="inletTypeTangent"
											disabled={mode !== 'set'}
											checked={type === 'Tangent'}
										/>
										<label className="form-check-label mx-1" htmlFor="inletTypeTangent">
											<div>
												Tangent
											</div>
										</label>
									</div>
								</td>
								<td colSpan={2}>
									<div id="inlet_viewer__wrapper">
										<img id="inlet_viewer__wrapper__img" src={
											type === "Straight" ? Straight :
												type === "Hook" ? Hook :
													type === "Direct" ? Direct :
														type === "Tangent" ? Tangent : ''
										}
										/>
									</div>
								</td>
							</tr>
							<tr>
								<td colSpan={2}>
									<div className="d-flex ms-3">
										<button
											className="btn btn-sm btn-primary btn_inletApplyForAll"
											id="inletApplyForAll"
										>
											Apply for all
										</button>
									</div>
								</td>
							</tr>
							<tr>
								<td colSpan={2} id="inletParams" >
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
																	id="inletHookR"
																	step="0.05"
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
																	id="inletHookL"
																	step="0.1"
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
																		id="inletDirectL"
																		step="0.5"
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
																	id="inletDirectA"
																	step={1}
																	min={0}
																	/* max={180} */
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
																		id="inletTangentR"
																		step={0.05}
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
																		id="inletTangentL"
																		step={0.05}
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
				</div>),
		},
	]
	return (
		<>
			{panelInfo.map((element) => (
				<Panel key={'panel' + 7} element={element} index={7} />
			))}
		</>
	);
})

export default InletPanel;