import { makeAutoObservable } from "mobx";

class PanelStore {
  coords = { x: 0, y: 0 };

  constructor() {
    makeAutoObservable(this);
  }

  minimize_all_panels () {

  }

  setCoords(newCoords) {
    this.coords = newCoords;
  }
}

const panelStore = new PanelStore();
export default panelStore; // Default export
