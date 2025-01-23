// EditorStore.js
import { makeAutoObservable, toJS } from "mobx";

class EditorStore {
    mode = 'resize'
    inletMode = ''
    constructor() {
        makeAutoObservable(this);
    }

    setMode(newMode) {
        this.mode = newMode;
    }

    setInletMode(newMode) {
        this.inletMode = newMode;
    }
}

const editorStore = new EditorStore();
export default editorStore; 
