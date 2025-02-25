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
import { toJS } from "mobx";
import CONSTANTS from '../../constants/constants.js';
import svgPath from 'svgpath';


const TextPanel = observer(() => {
	const { t } = useTranslation();
	const {	textFocus, selectedText } = svgStore;
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

	useEffect(()=>{
		console.log ('Current TEXT  ', toJS(selectedText))
	},[ selectedText ])	

	
	const deleteLastLetter =()=>{
	}

	const addCursor = ()=>{
		console.log ('addCursor')
	}

	const onKeyUp =(e)=>{
		console.log ("Added key  " + e.code)
		if (e.code  === "Backspace") {
			textCompare () 
		} else if (e.code  === "ArrowUp") {
			addCursor ('atPosition', {})
		} else if (e.code  === "ArrowDown") {
			addCursor ('atPosition')
		} else if (e.code  === "ArrowLeft") {
			addCursor ('atPosition')
		} else if (e.code  === "ArrowRight") {
			addCursor ('atPosition')
		} else if (e.code  === "Delete") {
			textCompare () 
		} else {
			let shortCuts= ['z','a','v','c','x','Z','A','V','C','X']
			if (e.ctrlKey && shortCuts.includes (e.code) ) return;			
			svgStore.updateElementValue(selectedText.cid, 'contour', 'text', textareaRef.current.value )
			textCompare () 
		}		
	}

	const textCompare =()=>{
		if (!selectedText) return;
		console.log ('textCompare')

        if (selectedText.text === textareaRef.current.value) {
			insertLetter(selectedText.text[selectedText.text.length-1])
			return
		}  else {

            /*let selectedTextWithoutLast = selectedText.text.slice(0, -1);
            let currentTextWithoutLast = textareaRef.current.value.slice(0, -1);

 			if ( currentTextWithoutLast === selectedText.text) {
				insertLetter( areaText[areaText.length-1] )
			} else {
				areaText.map(a => insertLetter(a));
			} 

            if (selectedTextWithoutLast === textareaRef.current.value) {
                deleteLastLetter()
		        return
			} */
		} 
	}

	const insertLetter =(letter)=>{
		console.log (letter)
		if (!selectedText) return;

		if (!GOST.hasOwnProperty(letter)) return;
		let addingLetter = GOST[`${letter}`]
		
		let correction =0 
		if (GOST.GOSTIntends.hasOwnProperty(letter)) {
			correction = GOST.GOSTIntends[letter]
		} 

		let scale = selectedText.fontSize/CONSTANTS.fontSize
		let scaleX = 1
		let scaleY = 1 
		let strings = 0

		let letterBox  = SVGPathCommander.getPathBBox(addingLetter)
		let textBox = SVGPathCommander.getPathBBox(selectedText.path)
		let translateX = selectedText.coords.x + textBox.width - letterBox.x + 1
		let translateY = ((selectedText.coords.y-letterBox.height-letterBox.y+correction*scale*scaleY+CONSTANTS.defaultStringInterval*strings*scale*scaleY))

        

		if (selectedText.text.length > 1) {
			translateX =  textBox.x2  + CONSTANTS.textKerning - letterBox.x
		}

		let addingLetterPath = util.applyTransform(addingLetter, scale, scale, translateX, translateY,{angle: 0, x:0, y:0})
		console.log ( addingLetterPath )
		let updatePath =  selectedText.path + addingLetterPath
		svgStore.updateElementValue(selectedText.cid, 'contour', 'path', updatePath  )
      
		
		
	}

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
											id="fontSize"
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
											onKeyUp={ onKeyUp }								
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