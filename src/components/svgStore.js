// SvgStore.js
import { makeAutoObservable } from "mobx";
import { toJS } from "mobx";

class SvgStore {
	svgData = { width: 0, height: 0, code: [] }; // Хранилище объекта SVG

	constructor() {
		makeAutoObservable(this); // Делаем свойства наблюдаемыми
	}

	setSvgData(newData) {
		console.log(newData)
		this.svgData = newData; // Устанавливаем новые данные SVG
	}

	clearSvgData() {
		this.svgData = { width: 0, height: 0, code: [] }; // Очищаем данные SVG
	}

	removeLastCodeElement() {
		console.log ('removeLastCodeElement')
		if (this.svgData.code.length > 0) {
			//this.svgData.code.pop();
			this.svgData.code = this.svgData.code.slice(0, -1);
			console.log('LLL: '+ this.svgData.code.length)
		}
	}

	removeElementByCidAndClass(cid, className) {
		this.svgData.code = this.svgData.code.filter(
			(element) => element.cid !== cid || !element.class.includes(className)
		);
	}

	updateElementValue(cid, className, val, newVal) {
		const element = this.svgData.code.find(
			(el) => el.cid === cid && el.class.includes(className)
		);
		if (element && val in element) {
			element[val] = newVal; // Обновляем значение указанного ключа
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
	

	printStore() {
		this.svgData['code'].forEach(element => {
                 console.log("printStore:", toJS(element));
        });
	}
}

const svgStore = new SvgStore();
export default svgStore;
