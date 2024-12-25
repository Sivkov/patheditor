// EditorStore.js
import { makeAutoObservable, toJS } from "mobx";

class EditorStore {
    mode = 'resize'
    constructor() {
        makeAutoObservable(this);
    }

    setMode(newMode) {
        this.mode = newMode;
    }

}

const editorStore = new EditorStore();
export default editorStore; 
