import { Icon } from '@iconify/react';
import Panel from './panel.js';
import '@fortawesome/fontawesome-free/css/all.css'
import { observer } from 'mobx-react-lite';
import svgStore from "../stores/svgStore.js";
import panelStore from '../stores/panelStore.js';
import { useEffect, useRef } from 'react';
import util from '../../utils/util.js';
//import { addToLog } from './../../scripts/addToLog.js';
import { useTranslation } from 'react-i18next';
import GOST from '../../constants/gost.js';
//import { toJS } from "mobx";
import CONSTANTS from '../../constants/constants.js';



const TextPanel = observer(() => {
	const { t } = useTranslation();
	const {	textFocus, selectedText } = svgStore;
	const textareaRef = useRef(null);
	const {positions} = panelStore

	useEffect(() => {
		if (textareaRef.current) {
		  	if (textFocus) {
			
				console.log("Handle focus", textFocus);
				miniTextPanel(false)
				//TODO при смене значения textFocus в сторе не успевает уйти фокус и курсор не ставиться. Так что пока так.
				setTimeout(()=>{

					textareaRef.current.focus();
					textareaRef.current.click();
					const cursorPosition = textareaRef.current.value.length;
					textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);


				},100)
			
			} else {
				textareaRef.current.value = ''
				miniTextPanel(true)				
			}
		}
	}, [textFocus]); 

	const miniTextPanel =(val)=> {
		let id = 'textPopup'
		if (positions[id].mini !== val) {
			let position = {
				style:{
					width: positions[id].style.width,
					height:positions[id].style.height,
					top:   positions[id].style.top,
					left:  positions[id].style.left				
				}
			}
			position.mini = val
			panelStore.setPosition(id, position)
		}
	}

	useEffect(()=>{
		if (selectedText) {
			textareaRef.current.value = selectedText.text
		}
	},[ selectedText ])	

	const addCursor =()=>{
		console.log ('addCursor')
	}

	const onKeyUp =(e)=>{
		if (!selectedText) {
			textareaRef.current.value=''
			return
		}
		//console.log ("Added key  " + e.code)
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
			textCompare () 
		}		
	}

	const  textCompare =()=>{
		if (!selectedText) return;
		const selectedTextValue = selectedText.text; // Текст из selectedText
		const textareaValue = textareaRef.current.value; // Текст из textarea

		if (selectedTextValue === textareaValue) {
			//false
		} else if (selectedTextValue === textareaValue.slice(0,-1) && selectedTextValue.length) {
			
			console.log('add last letter')			
 			const lastLetter = textareaValue[textareaValue.length - 1];
			const string = selectedTextValue.split('\n').reverse()[0] 
			const index = string.length
			const stringNum = selectedTextValue.split('\n').length-1
			const paths = selectedText.path.split(/(?=M)/)
			let pathsInLastString =0
			string.split('').map( a=>{
				if (GOST.hasOwnProperty(a)) {
					let mm = (GOST[a].match(/M/gm)||'').length
					pathsInLastString += mm
				}
			})

			const stringBox = (string && pathsInLastString) ? paths.slice( -pathsInLastString ).join('') : ''
			let res = insertLetter(lastLetter, index, textareaValue.length - 1, stringNum, stringBox)||'';
			svgStore.updateElementValue(selectedText.cid, 'contour', 'path', selectedText.path + res  )      

		} else if (selectedTextValue.slice(0,-1) === textareaValue) {

			console.log('delete last letter')
			const lastLetter = selectedTextValue[selectedTextValue.length - 1];
			const pathsInLetter = GOST[lastLetter] ? ( GOST[lastLetter].match(/M/gm)||'' ).length : 0

			let paths = selectedText.path.split(/(?=M)/);
			// это если энтер то 0 и нечего удадлять не надо!)))
			if (pathsInLetter) {

				if (pathsInLetter >= paths.length) {
					paths = ''; // Удаляем все пути
				} else {
					paths = paths.slice(0, -pathsInLetter).join(''); // Удаляем последние n путей
				}
				svgStore.updateElementValue(selectedText.cid, 'contour', 'path', paths);
			}

		} else {
			console.log('Перерисовываем все заново !!')
			let updatePath= ''
			//svgStore.updateElementValue(selectedText.cid, 'contour', 'path', '' )
			let string = 0
			let stringBox = ''
			let index = 0
			textareaValue.split('').forEach((a, ii) => {
				if (a ==='\n') {
					string++
					index = 0
					stringBox = ''
				} else {
					let res = insertLetter(a, index, ii, string, stringBox)||'';
					updatePath += res
					stringBox += res
					index++;
				}
			});
			svgStore.updateElementValue(selectedText.cid, 'contour', 'path', updatePath  )      

		}
		svgStore.updateElementValue(selectedText.cid, 'contour', 'text', textareaRef.current.value )
   
	}

 	const insertLetter = (letter,index, ii, string, stringBox)=>{

		if (!selectedText) return;

		if (!GOST.hasOwnProperty(letter)) return;
		let addingLetter = GOST[`${letter}`]
		
		let correction =0 
		if (GOST.GOSTIntends.hasOwnProperty(letter)) {
			correction = GOST.GOSTIntends[letter]
		} 

		let scale = selectedText.fontSize/CONSTANTS.fontSize
		let scaleX = selectedText.scaleX
		let scaleY = selectedText.scaleY 
		addingLetter = util.applyTransform(addingLetter, scale*scaleX, scale*scaleY, 0, 0,{angle: 0, x:0, y:0})
		//addingLetter = util.applyTransform(addingLetter, scaleX, scaleY, 0, 0,{angle: 0, x:0, y:0})
		//let letterBox  = SVGPathCommander.getPathBBox(addingLetter)
		//let textBox = SVGPathCommander.getPathBBox(stringBox)
		let letterBox = util.fakeBox(addingLetter)
		let textBox = util.fakeBox(stringBox)
		let translateX 
		let spaceK = 1
		if (ii) {
			let spaceCount = 0;
			let i = ii - 1; 
		
			while (i >= 0 && textareaRef.current.value[i] === ' ') {
				spaceCount++;
				i--; 
			}
		
			if (spaceCount > 0) {
				spaceK = 5 * spaceCount; 
			}
		}
		
		let translateY = ((selectedText.coords.y-letterBox.height-letterBox.y+correction*scale*scaleY+CONSTANTS.defaultStringInterval*string*scale*scaleY))

		if (index === 0 &&  spaceK===1 ) {
			translateX = selectedText.coords.x + textBox.width - letterBox.x
		//случай если строка начиается с пробелов
		} else if ( index - spaceK/5 === 0) {	
			translateX = selectedText.coords.x + textBox.width - letterBox.x + selectedText.kerning * spaceK* scaleX
		} else {
			translateX =  textBox.x2  + selectedText.kerning * spaceK * scaleX - letterBox.x
		}
		
		let addingLetterPath /* = util.applyTransform(addingLetter, scale, scale, 0, 0,{angle: 0, x:0, y:0})
		addingLetterPath  */= util.applyTransform(addingLetter, 1, 1, translateX, translateY,{angle: 0, x:0, y:0})
		return addingLetterPath		
	} 

	const setTextKerining =(e)=> {
		let val = Number(e.target.value);
		if (typeof val === "number" && val > 0) {
			console.log ('setTextKerining')
			svgStore.updateElementValue(selectedText.cid, "contour", "kerning", val);
			svgStore.updateElementValue(selectedText.cid, "contour", "text", '');
			textCompare()
		}
	}

	const setFontSize =(e)=> {
		let val = Number(e.target.value);
		if (typeof val === "number" && val > 0) {
			console.log ('setFontSize')
			svgStore.updateElementValue(selectedText.cid, "contour", "fontSize", val);
			svgStore.updateElementValue(selectedText.cid, "contour", "text", "");
			textCompare()
		}
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
											step={0.5}
											onChange={ setFontSize }
											value={selectedText ? selectedText.fontSize : CONSTANTS.fontSize}
										/>
										<div>{t('mm')}</div>
										</div>
										<div className="d-flex align-items-center ms-4">
										<div htmlFor="kerning">
											<Icon icon="carbon:text-kerning" width="24" height="24"  style={{color: 'white'}} />
										</div>
										<input
											className="mx-2 text-center"
											id="kerning"
											type="number"
 											min={0.1}
											max={100}
											step={0.1}
											onChange={ setTextKerining }
											value={selectedText ? selectedText.kerning : CONSTANTS.kerning}
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