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
        selectedPath,
        selectedInletPath
        } = svgStore;

	const [type, setType] = useState( Straight )

     
	useEffect(()=>{
        let inletMode = Straight
        if (selectedInletPath) {
            let path = SVGPathCommander.normalizePath(selectedInletPath ).map(a=> a.join(' ')).join(' ')
            if (path && path.length) {
                if ( path.includes('L') || path.includes('H') || path.includes('V') )  {
                    inletMode= Direct       
                    if ( path.includes('A') )  {
                        inletMode= Hook      
                    }
/*                     // пока рисуем треугольник определяем так
                    if (path.match(/L/g) && path.match(/L/gm).length && path.match(/L/gm).length === 3) {
                        inletMode= Straight      
                    } */
                } else if ( path.includes('A') ){
                    inletMode= Tangent        
                }
            }  
        }
        
		setType ( inletMode )       
 	},[ selectedInletPath ])

	const panelInfo = [
		  {
			id: 'inletPopup',
			fa: (<>
            <Icon icon="ion:enter-outline" width="24" height="24" style={{color: 'white'}} className='me-2' /><div>Inlet</div></>),
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
        <td className='col-4'>
          <div className="d-flex">
            <input
              className="form-check-input mt-0 inletMode"
              type="radio"
              name="inletMode"
              id="inletModeSet"
            />
            <label className="form-check-label" htmlFor="inletModeSet">
              Set
            </label>
          </div>
        </td>
        <td className='col-4'>
          <div className="d-flex">
            <input
              className="form-check-input mt-0 inletMode"
              type="radio"
              name="inletMode"
              id="inletModeEdit"
            />
            <label className="form-check-label" htmlFor="inletModeEdit">
              Edit
            </label>
          </div>
        </td>
        <td className='col-4'>
          <div className="d-flex">
            <input
              className="form-check-input mt-0 inletMode"
              type="radio"
              name="inletMode"
              id="inletModeMove"
            />
            <label className="form-check-label" htmlFor="inletModeMove">
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
              disabled=""
              checked={ type === Straight}
            />
            <label className="form-check-label" htmlFor="inletTypeStraight">
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
              disabled=""
              checked={ type === Direct}

            />
            <label className="form-check-label" htmlFor="inletTypeDirect">
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
              disabled=""
              checked={ type === Hook}
            />
            <label className="form-check-label" htmlFor="inletTypeHook">
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
              disabled=""
              checked={ type === Tangent}
            />
            <label className="form-check-label" htmlFor="inletTypeTangent">
              <div>
                Tangent
              </div>
            </label>
          </div>
        </td>
        <td colSpan={2}>
          <div id="inlet_viewer__wrapper">
            <img id="inlet_viewer__wrapper__img" src={type} />
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
        <td colSpan={2} id="inletParams" />
      </tr>
      <tr className="d-none">
        <td colSpan={2} id="inletPath" contentEditable="true" />
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