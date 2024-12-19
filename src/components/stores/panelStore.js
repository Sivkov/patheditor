import { makeAutoObservable } from "mobx";
import CONSTANTS from "../../constants/constants";


class PanelStore {

	positions = CONSTANTS.panelPostions
	constructor() {
		makeAutoObservable(this);
	}

	getInitialPositions() {
		const pp = JSON.parse(localStorage.getItem('pp'));
		if (pp) {
			for (let key in pp) {
				if (pp.hasOwnProperty(key)) {
					this.positions[key] = pp[key];
				}
			}
		}
	}

	setPosition(id, positions) {
		this.positions[id]=positions
	}

}

const panelStore = new PanelStore();
export default panelStore; // Default export
