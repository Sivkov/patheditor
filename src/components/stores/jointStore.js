import { makeAutoObservable, computed } from "mobx";

class JointStore {
	joints = [
		{ x: 0, y: 0 },
		{ x: 20, y: 20 },
		{ x: 50, y: 50 },
		{ x: 100, y: 100 },
	]
	/*
	 
	{
	 6:{
	  atEnd: false/true
	  quantity:1
	  distance:50
	  manual:[10,20,25]
	 }
	}
	*/

	constructor() {
		makeAutoObservable(this, {
			jointsJSON:computed,
		});
		
	}

	get jointsJSON () {
		return JSON.stringify(this.joints)
	}

}

const jointStore = new JointStore();
export default jointStore; 
