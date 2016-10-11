import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";

class MyShowsStore extends EventEmitter{
	constructor(){
		super();
		this.MyShows = [];
	}

	_setMyShows(data){
		this.MyShows = data;
		this.emit('change', "MyShowsList");
	}

	_getMyShowsList(){
		return this.MyShows;
	}

	_handleActions(action){
		switch(action.type){
			case "MY_SHOWS_LIST" : {
				this._setMyShows(action.data);
				break;
			}
		}
	}
}

const myshowsstore = new MyShowsStore;
dispatcher.register(myshowsstore._handleActions.bind(myshowsstore));
export default myshowsstore;
