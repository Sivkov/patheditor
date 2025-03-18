import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import Part from '../scripts/part';
import { useState } from 'react';


const ExitModalComponent = ({action})=> {
	const { t } = useTranslation();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	let capitalized = action.charAt(0).toUpperCase() + action.slice(1);

	const saveAndExit =()=>{
		Part.savePart( action )
	}

	const exit =()=>{
		Part.cleanHandle( action )
	}	
	 
	return (
		<>
			<Button variant="" onClick={handleShow} className=''>
				<div
					className="text-white btn_shapes btn_tool"
				>
					{t( capitalized )}
				</div>
			</Button>
			<Modal variant="" show={show} onHide={handleClose}>
				<Modal.Header closeButton className="custom_modal">
					<Modal.Title>{t('Do you want to')}...</Modal.Title>
				</Modal.Header>
				<Modal.Body className="custom_modal">	
				<div>
					<h4>{t('finish part editing and close this page?')}</h4>
				</div>									
				</Modal.Body>
				<Modal.Footer className="custom_modal">
					<Button variant="warning" 
						onClick={handleClose}>
						{t('Cancel')}
					</Button>
					<Button variant="secondary" 
						onClick={handleClose}
						onMouseDown={ exit }>
						{t('Exit without saving')}
					</Button>
					<Button variant="primary" 
						onClick={ handleClose }
						onMouseDown={ saveAndExit }>
						{t('Save and exit')}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default ExitModalComponent;