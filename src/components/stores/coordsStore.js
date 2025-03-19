// CoordsStore.js
import { makeAutoObservable } from "mobx";

class CoordsStore {
  coords = { x: 0, y: 0 };
  needeToFit = false;
  fittedPosition = false;
  preloader = true;


  constructor() {
    makeAutoObservable(this);
  }

  setCoords(newCoords) {
    //console.log ('setCoords' + newCoords)
    this.coords = newCoords;
  }

  setNeedToFit (val) {
    this.needeToFit = val
  }

  setFittedPosition (val) {
    //console.log (JSON.stringify(val))
    this.fittedPosition = val
  }

  setPreloader (val) {
    this.preloader = val;
  }



}

const coordsStore = new CoordsStore();
export default coordsStore; // Default export
