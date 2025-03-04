import { makeAutoObservable, observable, computed } from "mobx";
import svgStore from "./svgStore";
import SVGPathCommander from "svg-path-commander";

class JointStore {
    joints = {};

    constructor() {
        makeAutoObservable(this, {
			joints: observable, 
			jointPositions:computed,
		});
    }

	get jointPositions() {
		let positions = [];
		console.log ("calculate joint positions")
		
		for (let key in this.joints) {
			let cid = Number(key); // Преобразуем ключ в число
			let jointData = this.joints[key];
	
			if (!jointData) continue; // Если данных нет — пропускаем

	
			let contour = svgStore.getElementByCidAndClass(cid, 'contour');
			if (!contour || !contour.path) continue; // Проверяем, существует ли объект
			
			let path = contour.path;
			let updPath = SVGPathCommander.normalizePath(path);	
			let totalLength = SVGPathCommander.getTotalLength(path);

	
			if (jointData.hasOwnProperty('atEnd') && jointData.atEnd) {
				let last = updPath[updPath.length - 1];
				if (Array.isArray(last) && last.length >= 2) { // Проверяем корректность `last`
					let x = last[last.length - 2];
					let y = last[last.length - 1];
					positions.push({ x, y });
				}
			}

			if (jointData.hasOwnProperty('quantity') && jointData.quantity) {
				let numSegments = jointData.quantity + 1; // Количество отрезков
				for (let i = 1; i < numSegments; i++) { // Пропускаем первую (начальную) и последнюю точки
					let segmentLength = (totalLength / numSegments) * i;
					let { x, y } = SVGPathCommander.getPointAtLength(path, segmentLength); // Берём точку на пути
					positions.push({ x, y });
				}
			}

			if (jointData.hasOwnProperty('distance') && jointData.distance) {
				let step = jointData.distance;
					for (let length = step; length < totalLength; length += step) {
					let { x, y } = SVGPathCommander.getPointAtLength(path, length);
					positions.push({ x, y });
				}
			}

			if (jointData.hasOwnProperty('manual') && Array.isArray(jointData.manual)) {
				jointData.manual.forEach(percent => {
					if (typeof percent === 'number' && percent >= 0 && percent <= 100) {
						let lengthAtPercent = (totalLength * percent) / 100;
						let { x, y } = SVGPathCommander.getPointAtLength(path, lengthAtPercent);
						positions.push({ x, y });
					}
				});
			}
		}
		return positions;
	}

	get jointsForSelectedCid() {
		if (!svgStore.selectedCid) return null;		
		return this.joints[svgStore.selectedCid] || null;
	}

	updJointVal(cid, param, val) {
		console.log(cid, param, val);
		if (!this.joints[cid]) {
			this.joints[cid] = {}; 
		  }
	
		  if (val === false) {
			// Удаляем параметр
			delete this.joints[cid][param];
	
			// Если объект стал пустым, удаляем cid из joints
			if (Object.keys(this.joints[cid]).length === 0) {
			  delete this.joints[cid];
			}
		  } else {
			// Обновляем значение
			Object.assign(this.joints[cid], { [param]: val });
		}
	}
}

const jointStore = new JointStore();
export default jointStore;
