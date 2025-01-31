// SvgStore.js
import { makeAutoObservable, computed } from "mobx";
import { toJS } from "mobx";
import Part from "../../scripts/part";
import SVGPathCommander from "svg-path-commander";
import Inlet from "../../scripts/inlet";
import CONSTANTS from "../../constants/constants";

class SvgStore {
	svgData = { width: 0, height: 0, code: [], params:{id:'',uuid:'',pcode:''} }; // Хранилище объекта SVG
	selectorCoords ={ x: 0, y: 0, width: 0, height: 0 }
	inletSafeMode = {mode: false, intend: CONSTANTS.defaultInletIntend}

	constructor() {
		makeAutoObservable(this, {
			selectedCid: computed,
			selected: computed,
			selectedPath: computed,
            selectedType: computed,
			selectedPiercingType: computed,
			selectedInletModeType: computed,
			selectedContourModeType: computed,
			tecnology: computed,
			selectedInletPath: computed,
			selectedOutletPath: computed,
        });
    }

	get selectedInletPath () {
		let cid = this.selected.cid
		if (typeof cid === 'number') {
			return this.getElementByCidAndClass(cid, 'inlet', 'path')	|| ''
		}	
	}

	get selectedOutletPath () {
		let cid = this.selected.cid
		if (typeof cid === 'number') {
			return this.getElementByCidAndClass(cid, 'outlet', 'path')	|| ''
		}	
	}

	get selectedCid () {
		const selected = this.getSelectedElement();
		if (selected) {
			if (selected.hasOwnProperty('cid')){
				return selected.cid
			}
		}
		return -1;
	}

	get selectedPath () {
		const selected = this.getSelectedElement();
		if (selected) {
			if (selected.hasOwnProperty('path')){
				return selected.path
			}
		}
		return '';
	}

	get selected () {
		const selected = this.getSelectedElement();
		if (selected) {
			return selected;		 
		}
		return '';
	}

	get tecnology () {
		let allClasses =''
		this.svgData['code'].forEach(element => {
			allClasses+=' '
			allClasses+=element.class
			allClasses+=' '
   		});
		let allTec = [...new Set (allClasses.split(/\s{1,}/gm))]
		console.log("printStore:", toJS(allTec));
	    return allTec
	}

	get selectedPiercingType () {
		const selected = this.getSelectedElement();
		if (selected) {
			const inletClass = this.getElementByCidAndClass (selected.cid, 'inlet', 'class')
			if (inletClass){
				return Part.detectPiercingType(inletClass);
			}
		}
		return '';
	}

	get selectedInletModeType () {
		const selected = this.getSelectedElement();
		if (selected) {
			const inletClass = this.getElementByCidAndClass (selected.cid, 'inlet', 'class')
			if (inletClass) {
				return Part.detectContourModeType(inletClass);
			}	
		}
		return '';
	}

	get selectedContourModeType () {
		const selected = this.getSelectedElement('class');
		if (selected) {
			return Part.detectContourModeType(selected);
		}
		return '';
	}

	get selectedType() {
		const selected = this.getSelectedElement('class');
		if (selected) {
			return Part.detectContourType(selected);
		}
		return '';
	}

	setInletSafeMode (mode) {
		console.log(mode)
		this.inletSafeMode = mode
	}

	setSvgData(newData) {
		console.log(newData)
		this.svgData = newData; // Устанавливаем новые данные SVG
	}

	setNewPartSize (x,y) {
		this.svgData.width = x
		this.svgData.height = y
	}

	clearSvgData() {
		this.svgData = { width: 0, height: 0, code: [] , params:{}}; // Очищаем данные SVG
	}

	getElementByCidAndClass(cid, className, val = '') {
		const element = this.svgData.code.find(
			(el) => el.cid === cid && el.class.includes(className)
		);
	
		if (!element) {
			return null; 
		}
	
		return val ? element[val] || null : element;
	}
	
	removeElementByCidAndClass(cid, className) {
		console.log ('removeElementByCidAndClass', className, cid)
		this.svgData.code = this.svgData.code.filter(
			(element) => element.cid !== cid || !element.class.includes(className)
		);
	}

	updateElementValue(cid, className, val, newVal) {
		const element = this.svgData.code.find(
			(el) => el.cid === cid && el.class.includes(className)
		);
		if (element && val in element) {
			if (val === 'path') {
				if (this.inletSafeMode.mode) {
					console.log ("Need check inlet")
					element[val] = newVal; 					
				} else {
					console.log ("NO need  to check inlet")
					element[val] = newVal; 					
				}
			} else {
				element[val] = newVal; 
			}
		}
	}

	updateContourPath (cid, className, val, newVal, angle=false) {
		if (!angle) {
			angle ={angle: 0, x:0, y:0}
		}

		const inletC = svgStore.getElementByCidAndClass (cid, 'inlet')
		const outletC = svgStore.getElementByCidAndClass (cid, 'outlet')

		this.updateElementValue (cid, className, val, newVal)
		let start =  SVGPathCommander.normalizePath(newVal)[0]
		let contourStart =  {x: start[start.length-2], y: start[start.length-1]}
		let contour = this.getElementByCidAndClass (cid, 'contour')
		let contourType = contour.class.includes ('inner') ? 'inner' : 'outer'

		if (inletC && inletC.path) {
			let type = Inlet.detectInletType (inletC.path)
			let resp = Inlet.setInletType ( type, contourStart, 'update', newVal, inletC.path, contourType) 
			if ( resp ) {
					svgStore.updateElementValue ( cid, 'inlet', 'path', resp.newInletPath )
				} else {
					console.log ('Invalid PATH')
			}
		}

		if (outletC && outletC.path) {			
			let type = Inlet.detectInletType (outletC.path)
			let resp = Inlet.setOutletType ( type, contourStart, 'update', newVal, outletC.path, contourType) 
			if ( resp ) {
					svgStore.updateElementValue ( cid, 'outlet', 'path', resp.newOutletPath )
				} else {
					console.log ('Invalid PATH')
			}
		} 
	}

	setContourSelected(cid) {
		console.log('setContourSelected ' + cid)
 		this.svgData.code.forEach((el, i, arr)=>{
			if(el.hasOwnProperty('selected')) {
				this.updateElementValue (el.cid, 'contour', 'selected', false)		
			}
		}) 
		this.updateElementValue (cid, 'contour', 'selected', true)
	}

	getSelectedElement(val = '') {	
		const selectedElement = this.svgData.code.find(element => element.selected);
		if (!selectedElement) {
			return null;
		}
		return val ? selectedElement[val] || null : selectedElement;
	}

	getOuterElement(val = '') {	
		const outer = this.svgData.code.find(element => element.class.includes('outer') && element.class.includes('contour'));
		if (!outer) {
			return null;
		}
		return val ? outer[val] || null : outer;
	}

	getFiltered (filter ='contour') {	
		const filtered = this.svgData.code.filter(element => element.class.includes( filter));
		if (!filtered) {
			return [];
		}
		console.log ('filtered', toJS(filtered))
		return filtered
	}

	deleteSelected () {
		let selected = this.getSelectedElement()	
		let cidSelected = selected.cid		

		if (typeof cidSelected === 'number') {
			['inlet', 'outlet', 'contour', 'joint'].map(a =>{
				this.removeElementByCidAndClass(cidSelected, a)
			})
		}
	}

	printStore() {
		this.svgData['code'].forEach(element => {
                 console.log("printStore:", toJS(element));
        });
	}

	setSelectorCoords (val) {
		this.selectorCoords =  val
	}
}

const svgStore = new SvgStore();
export default svgStore;
