// CoordsStore.js
import { makeAutoObservable } from "mobx";

class CoordsStore {
  coords = { x: 0, y: 0 };
  needeToFit = false

  constructor() {
    makeAutoObservable(this);
  }

  setCoords(newCoords) {
    //console.log ('setCoords' + newCoords)
    this.coords = newCoords;
  }

  setFitted (val) {
    this.needeToFit = val
  }

}

const coordsStore = new CoordsStore();
export default coordsStore; // Default export
