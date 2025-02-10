import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap/dist/css/bootstrap.min.css';


const ShapeModalComponent =()=> {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [selected, setSelected] = useState(0)
	let shapes = [
		"M10 5 A5 5 0 0 0 0 5 A5 5 0 0 0 5 10 A5 5 0 0 0 10 5",
		"M5 0 H10 V10 H0 L0 0 L5 0",
		"M10 10 0 10 5 1.34 L10 10" , 
		"M4.86 9.27 L 1.78 9.27 L 0 3.54 L 4.86 0 L 9.72 3.54 L 7.94 9.27 L 4.86 9.27",
		"M9.41 5 9.41 7.5 5.08 10 .75 7.5.75 2.5 5.08 0 9.41 2.5 9.41 5",	
	]

	return (
		<>
			<Button variant="" onClick={handleShow} className='mt-1 ms-2'>
				<div
					className="text-white btn_shapes btn_tool"
				>
					<i className="fa-solid fa-shapes"></i>
				</div>
			</Button>

			<Modal variant="" show={show} onHide={handleClose}>
				<Modal.Header closeButton className="custom_modal">
					<Modal.Title>Add contoour</Modal.Title>
				</Modal.Header>
				<Modal.Body className="custom_modal">
					<div className="modal-body">
						<div className="d-flex align-items-center justify-content-center">						
						{
							shapes.map((shape, i) => (
								<button 
									key={i} 
									className={"btn btn-shape-select m-2 d-flex align-items-center justify-content-center "+ (i === selected ? "btn-shape-selected" :"")}
									onMouseDown={ ()=>{ setSelected(i)}}
								>
									<div className='d-flex align-items-center justify-content-center shape-select-wrapper'>
										<svg
											width={10}
											height={10}
											xmlns="http://www.w3.org/2000/svg"
											style={{ transform: "scale(2.5)" }}
										>
											<path d={shape} stroke="" />
										</svg>
									</div>
								</button>
							))
						}
						</div>
						<div className="d-flex align-items-center justify-content-center mt-4">
							<table>
								<tbody>
									<tr>
										<td>
											<div>Положение центра X</div>
										</td>
										<td>
											<div className="">
												<input
													className="mx-2"
													id="newPartPositionX"
													type="number"
													min={1}
													max={1500}
													step={1}
													defaultValue={0}
												/>
												mm
												<input
													className="mx-2"
													id="newPartPositionXCenter"
													type="checkbox"
													defaultChecked=""
												/>
												В середине X
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div>Положение центра Y</div>
										</td>
										<td>
											<div className="">
												<input
													className="mx-2"
													id="newPartPositionY"
													type="number"
													min={1}
													max={2500}
													step={1}
													defaultValue={0}
												/>
												mm
												<input
													className="mx-2"
													id="newPartPositionYCenter"
													type="checkbox"
													defaultChecked=""
												/>
												В середине Y
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div>Ширина</div>
										</td>
										<td>
											<input
												className="mx-2"
												id="newPartShapesX"
												type="number"
												min={1}
												max={1500}
												step={1}
												defaultValue={100}
											/>
											mm
										</td>
									</tr>
									<tr>
										<td>
											<div>Высота</div>
										</td>
										<td>
											<input
												className="mx-2"
												id="newPartShapesY"
												type="number"
												min={1}
												max={2500}
												step={1}
												defaultValue={100}
											/>
											mm
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="custom_modal">
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleClose}>
						Add Contour
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default ShapeModalComponent;