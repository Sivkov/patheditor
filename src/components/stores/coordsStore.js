// CoordsStore.js
import { findAllByTestId } from "@testing-library/react";
import { makeAutoObservable } from "mobx";

class CoordsStore {
  coords = { x: 0, y: 0 };
  needeToFit = false
  fittedPosition = false

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

  setFittedPosition (val) {
    console.log (JSON.stringify(val))
    this.fittedPosition = val
  }

}

const coordsStore = new CoordsStore();
export default coordsStore; // Default export
