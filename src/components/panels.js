import React, { useState }  from 'react';
import { Icon } from '@iconify/react';
import Panel from './panel';

const Panels = () => {

	const [inputValue, setInputValue] = useState('');

	const handleInputChange = (event) => {
	  setInputValue(event.target.value);
	};

	function __ (w) { return w}
	function mirror () {}
	function deleteP(){}
	const panelInfo = [
		{
			id: 'toolsPopup',
			mini: false,
			fa: (<Icon icon="heroicons:wrench-screwdriver-20-solid"/>),
			style: {
				top: 200,
				left: 800,
				width: 140,
				height:300 
			  },
			content: (
			<div className="d-flex align-items-center btn_block flex-wrap">
		 <button type="button" className="btn text-white mt-1 ms-2 btn_mode btn_arrow_mode">
		 	<Icon icon="fa6-solid:arrow-pointer" />
 		 </button>
		 <button type="button" className="btn mt-1 ms-2 btn_mode btn_inverse_selection">
		 	<Icon icon="fa6-solid:arrow-pointer" color="#02feff" />
		 </button>
		 <button type="button" className="btn text-white mt-1 ms-2 btn_mode btn_selection_plus">
			<div className="d-flex flex-row align-items-center justify-content-center">
				<Icon icon="fa6-solid:arrow-pointer" />
				<div style={{ marginTop: 11+'px'}}>+</div>
			 </div> 
		</button>
		<button type="button" className="btn text-white mt-1 ms-2 btn_mode btn_selection_minus">
			<div className="d-flex flex-row align-items-center justify-content-center">
				<Icon icon="fa6-solid:arrow-pointer" />
				<div style={{ marginTop: 11+'px'}}>-</div>
			</div> 
		</button>
		<button type="button" className="btn text-white mt-1 ms-2 btn_mode btn_zoom_mode">
				<Icon icon="fa6-solid:hand"/>
		 </button>
		 <button type="button" className="btn text-white mt-1 ms-2 btn_mode btn_ruler_mode">
			 <Icon icon="fa6-solid:ruler" />
		 </button>
		 <div className="ms-2 mt-1">
		 <div className="d-flex justify-content-center">
		   <div>
			 <input className="form-control form-control angle" type="number" required="" style={{width:71+'px'}} value="90" onChange={()=>{}}></input>
		   </div>
		   <div>
		   <button type="submit" className="btn text-white btn_rotate mt-1">
				<div className="d-flex flex-row align-items-top justify-content-center">
					<Icon icon="tabler:angle" />
					<div style={{ fontFamily: 'Font Awesome 6 Pro', marginTop: -7+'px' }}>°</div>
			   </div>
			</button>
		   </div>
		 </div>
		</div>
		 <button type="button" className="btn text-white mt-1 ms-2 btn_rotate_left">
			 <div className="d-flex flex-row align-items-top justify-content-center">
				<Icon icon="fa6-solid:rotate-left" />
				<div style={{ fontFamily: 'Font Awesome 6 Pro', marginTop: -7+'px' }}>°</div>
			</div>
		</button>
		 <button type="button" className="btn text-white mt-1 ms-2 btn_rotate_right">
			<div className="d-flex flex-row align-items-top justify-content-center">
				<Icon icon="fa6-solid:rotate-right" />
				<div style={{ fontFamily: 'Font Awesome 6 Pro', marginTop: -7+'px' }}>°</div>
			</div>
		 </button>
		 <button type="button" className="btn text-white mt-1 ms-2 btn_mirror vertical"
		 onMouseDown={mirror()}>
			<Icon icon="octicon:mirror-16" rotate={1} />
		</button>
		 <button type="button" className="btn text-white mt-1 ms-2 btn_delete"
			 onMouseDown={deleteP()}><Icon icon="fa6-solid:trash" />
		 </button>					
		</div>)
		},
		{
			id: 'toolsPopup1',
			mini: false,
			fa: (<Icon icon="heroicons:wrench-screwdriver-20-solid"/>),
			style: {
				top: 200,
				left: 900,
				width: 140,
				height:300 
			  },
			content: (
			<div className="d-flex align-items-center btn_block flex-wrap">
		 <button type="button" className="btn text-white mt-1 ms-2 btn_mode btn_arrow_mode">
		 	<Icon icon="fa6-solid:arrow-pointer" />
 		 </button>
		 <button type="button" className="btn mt-1 ms-2 btn_mode btn_inverse_selection">
		 	<Icon icon="fa6-solid:arrow-pointer" color="#02feff" />
		 </button>
		 <button type="button" className="btn text-white mt-1 ms-2 btn_mode btn_selection_plus">
			<div className="d-flex flex-row align-items-center justify-content-center">
				<Icon icon="fa6-solid:arrow-pointer" />
				<div style={{ marginTop: 11+'px'}}>+</div>
			 </div> 
		</button>
		<button type="button" className="btn text-white mt-1 ms-2 btn_mode btn_selection_minus">
			<div className="d-flex flex-row align-items-center justify-content-center">
				<Icon icon="fa6-solid:arrow-pointer" />
				<div style={{ marginTop: 11+'px'}}>-</div>
			</div> 
		</button>
		<button type="button" className="btn text-white mt-1 ms-2 btn_mode btn_zoom_mode">
				<Icon icon="fa6-solid:hand"/>
		 </button>
		 <button type="button" className="btn text-white mt-1 ms-2 btn_mode btn_ruler_mode">
			 <Icon icon="fa6-solid:ruler" />
		 </button>
		 <div className="ms-2 mt-1">
		 <div className="d-flex justify-content-center">
		   <div>
			 <input className="form-control form-control angle" type="number" required="" style={{width:71+'px'}} value="90" onChange={()=>{}}></input>
		   </div>
		   <div>
		   <button type="submit" className="btn text-white btn_rotate mt-1">
				<div className="d-flex flex-row align-items-top justify-content-center">
					<Icon icon="tabler:angle" />
					<div style={{ fontFamily: 'Font Awesome 6 Pro', marginTop: -7+'px' }}>°</div>
			   </div>
			</button>
		   </div>
		 </div>
		</div>
		 <button type="button" className="btn text-white mt-1 ms-2 btn_rotate_left">
			 <div className="d-flex flex-row align-items-top justify-content-center">
				<Icon icon="fa6-solid:rotate-left" />
				<div style={{ fontFamily: 'Font Awesome 6 Pro', marginTop: -7+'px' }}>°</div>
			</div>
		</button>
		 <button type="button" className="btn text-white mt-1 ms-2 btn_rotate_right">
			<div className="d-flex flex-row align-items-top justify-content-center">
				<Icon icon="fa6-solid:rotate-right" />
				<div style={{ fontFamily: 'Font Awesome 6 Pro', marginTop: -7+'px' }}>°</div>
			</div>
		 </button>
		 <button type="button" className="btn text-white mt-1 ms-2 btn_mirror vertical"
		 onMouseDown={mirror()}>
			<Icon icon="octicon:mirror-16" rotate={1} />
		</button>
		 <button type="button" className="btn text-white mt-1 ms-2 btn_delete"
			 onMouseDown={deleteP()}><Icon icon="fa6-solid:trash" />
		 </button>					
		</div>)
		}
	]
return (
    <>
      {panelInfo.map((element, index) => (
        <Panel key={'panel' + index} element={element} index={index}/>
      ))}
    </>
  );
};

export default Panels;
