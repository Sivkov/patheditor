import { Icon } from '@iconify/react';
import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';
import svgStore from "../stores/svgStore.js";
import { useEffect, useRef } from 'react';
import SVGPathCommander from 'svg-path-commander';
import util from '../../utils/util.js';
import { addToLog } from './../../scripts/addToLog.js';
import { useTranslation } from 'react-i18next';
import GOST from '../../constants/gost.js';



const TextPanel = observer(() => {
	const { t } = useTranslation();
	const {	textFocus} = svgStore;
	const textareaRef = useRef(null);

	useEffect(() => {
		if (textareaRef.current) {
		  	if (textFocus) {
			
				console.log("Handle focus", textFocus);
				const cursorPosition = textareaRef.current.value.length;
				textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
				//TODO при смене значения textFocus в сторе не успевает уйти фокус и курсор не ставиться. Так что пока так.
				setTimeout(()=>{

					textareaRef.current.focus();
					textareaRef.current.click();

				},100)
			
			} else {
				textareaRef.current.value = ''
			}
		}
	  }, [textFocus]); 

	const panelInfo = 
		  {
			id: 'textPopup',
			fa: (<><Icon icon="nimbus:text-size" width="20" height="20"  style={{color: 'white'}} className='me-2'/><div>{t('Text')}</div></>),
			content:  (
				<div className="d-flex flex-column">
					<table className="table mb-0">
						<tbody>
							<tr>
								<td className="mx-2">
									<div className="d-flex align-items-center justify-content-center">
										<div className="d-flex align-items-center ">
										<div>
											<Icon icon="fluent:text-font-16-regular" width="20" height="20"  style={{color:'white'}} />
										</div>
										<input
											className="mx-2 text-center"
											id="textSize"
											type="number"
											min={1}
											max={100}
											step="0.5"
											defaultValue="11.88"
										/>
										<div>{t('mm')}</div>
										</div>
										<div className="d-flex align-items-center ms-4">
										<div htmlFor="textKerning">
											<Icon icon="carbon:text-kerning" width="24" height="24"  style={{color: 'white'}} />
										</div>
										<input
											className="mx-2 text-center"
											id="textKerning"
											type="number"
											placeholder={100}
											min="0.1"
											max={100}
											step="0.1"
											defaultValue={1}
										/>
										<div>{t('mm')}</div>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className="d-flex justify-content-around">
										<div className="mt-2">
										<textarea 
											ref={textareaRef} 
											id="textarea" 
											rows={4} 
											cols={40}
										/>
										<br />
										</div>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)
}    
	
return (
	<>
		<Panel key={'panel' + 12} element={panelInfo} index={12} />
	</>
	);
})

export default TextPanel;