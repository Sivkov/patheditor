import { makeAutoObservable } from "mobx";

class LogStore {
  log = []

  constructor() {
    makeAutoObservable(this);
  }

  add(newNote) {
    console.log('note added')
    this.log.push(newNote);
  }
}

const logStore = new LogStore();
export default logStore; 
