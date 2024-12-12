// SvgStore.js
import { makeAutoObservable } from "mobx";

class SvgStore {
  svgData = []; // Хранилище для массива SVG

  constructor() {
    makeAutoObservable(this); // Делаем свойства наблюдаемыми
  }

  setSvgData(newData) {
    this.svgData = newData; // Обновляем массив SVG
  }

  updateSvgElement(index, newElement) {
    if (index >= 0 && index < this.svgData.length) {
      this.svgData[index] = newElement; // Обновляем конкретный элемент массива
    }
  }

  clearSvgData() {
    this.svgData = []; // Очищаем массив
  }
}

const svgStore = new SvgStore();
export default svgStore;
