import { makeAutoObservable, observable, computed, set } from "mobx";
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
		//console.log ("calculate joint positions")
		
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
					let percent = 100
					positions.push({ x, y, percent, cid, origin:'atEnd' });
				}
			}

			if (jointData.hasOwnProperty('quantity') && jointData.quantity) {
				let numSegments = jointData.quantity + 1; // Количество отрезков
				for (let i = 1; i < numSegments; i++) { // Пропускаем первую (начальную) и последнюю точки
					let segmentLength = (totalLength / numSegments) * i;
					let { x, y } = SVGPathCommander.getPointAtLength(path, segmentLength); // Берём точку на пути
					let percent = segmentLength / totalLength *100
					positions.push({ x, y, percent, cid, origin:'quantity' });
				}
			}

			if (jointData.hasOwnProperty('distance') && jointData.distance) {
				let step = jointData.distance;
					for (let length = step; length < totalLength; length += step) {
					let { x, y } = SVGPathCommander.getPointAtLength(path, length);
					let percent = length / totalLength *100
					positions.push({ x, y, percent, cid, origin:'distance'});
				}
			}

			if (jointData.hasOwnProperty('manual') && Array.isArray(jointData.manual)) {
				jointData.manual.forEach(percent => {
					if (typeof percent === 'number' && percent >= 0 && percent <= 100) {
						let lengthAtPercent = (totalLength * percent) / 100;
						let { x, y } = SVGPathCommander.getPointAtLength(path, lengthAtPercent);
						positions.push({ x, y, percent, cid, origin:'manual' });
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

/* 	loadJoints(loaded) {
		let cids = new Set();
		let jointMap = {}; 
	
		loaded.forEach((elm) => {
			for (let key in elm) {
				cids.add(key);
				if (!jointMap[key]) {
					jointMap[key] = [];
				}
				jointMap[key].push(elm);
			}
		});
	
 		cids.forEach((cid) => {
			console.log(jointMap[cid]);
	
			jointMap[cid].forEach(j => {
				const { dp, d, d1 } = j[cid];

				if (d1 !== 0 && Math.abs(dp - (d / d1) * 100) < 0.01) {
					this.updJointVal(Number(cid), 'atEnd', true);
				}
			});
		});
	} */

	loadJoints(loaded) {
		let cids = new Set();
		let jointMap = {};
	
		// Группируем данные по cid
		loaded.forEach((elm) => {
			for (let key in elm) {
				cids.add(key);
				if (!jointMap[key]) {
					jointMap[key] = [];
				}
				jointMap[key].push(elm[key]); // Сохраняем только значения
			}
		});
	
		// Обрабатываем каждый уникальный cid
		cids.forEach((cid) => {
			console.log(`Обрабатываем cid: ${cid}`, jointMap[cid]);
	
			let dpValues = [];
			let dValues = []; // Сюда собираем все d (расстояния)
			
			jointMap[cid].forEach(j => {
				const { dp, d, d1 } = j;
	
				// Проверяем atEnd
				if (d1 !== 0 && Math.abs(dp - (d / d1) * 100) < 0.01) {
					this.updJointVal(Number(cid), 'atEnd', true);
				}
	
				dpValues.push(dp);
				dValues.push(d);
			});
	
			let foundRule = false;
			let usedDpValues = new Set();
			let usedDValues = new Set();
	
			// === 1. Определяем quantity (шаг по dp) ===
			if (dpValues.length > 1) {
				dpValues.sort((a, b) => a - b);
				let step = dpValues[1] - dpValues[0];
				let isConsistent = dpValues.every((val, i, arr) => 
					i === 0 || Math.abs(val - arr[i - 1] - step) < 0.01
				);
	
				if (isConsistent && 100 % step === 0) {
					this.updJointVal(Number(cid), 'quantity', (100 / step) - 1);
					foundRule = true;
					usedDpValues = new Set(dpValues);
				}
			}
	
			// === 2. Определяем distance (шаг по d) только если quantity НЕ найден ===
			if (!foundRule && dValues.length > 1) {
				dValues.sort((a, b) => a - b);
				let minStep = dValues[1] - dValues[0];
	
				let isDistanceConsistent = dValues.every((val, i, arr) => 
					i === 0 || Math.abs(val - arr[i - 1] - minStep) < 0.01
				);
	
				if (isDistanceConsistent) {
					this.updJointVal(Number(cid), 'distance', minStep);
					foundRule = true;
					usedDValues = new Set(dValues);
				}
			}
	
			// === 3. manual только для оставшихся joints ===
			let manualDp = dpValues.filter(dp => !usedDpValues.has(dp));
			if (manualDp.length > 0) {
				this.updJointVal(Number(cid), 'manual', manualDp);
			}
		});
	}	
	
	
	updJointVal(cid, param, val) {
		console.log(cid, param, val);
		if (!this.joints[cid]) {
			this.joints[cid] = {atEnd:false,distance:false,quantity:false,manual:[]}; 
		}
		if (param === 'manual' && !Array.isArray(val)) {
			let newVal =[...this.joints[cid]['manual'], val]
			Object.assign(this.joints[cid], { [param]: newVal });
		} else {
			Object.assign(this.joints[cid], { [param]: val });
		}		
	}

	removeJoint(params) {
		const { cid, percent, origin } = params;
		if (origin === 'manual' && this.joints[cid]?.manual) {
			let newVal = this.joints[cid].manual.filter(a => a !== percent);
			this.updJointVal(cid, 'manual', newVal);
		}

		if (origin === 'atEnd' && this.joints[cid]?.manual) {
			this.updJointVal(cid, 'atEnd', false);
		}

		if (origin === 'distance' && this.joints[cid]?.manual) {
			this.updJointVal(cid, 'distance', false);
		}

		if (origin === 'quantity' && this.joints[cid]?.manual) {
			this.updJointVal(cid, 'quantity', false);
		}
	}

	setData (data) {
		Object.assign(this.joints, data);
	}
}

const jointStore = new JointStore();
export default jointStore;
