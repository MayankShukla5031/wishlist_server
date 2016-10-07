import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";

class SnackBarStore extends EventEmitter{
	constructor(){
		super();
	}
	

	_handleActions(action){
		switch(action.type){
			case 'SNACKBAR' : {
				this.emit('change', 'SNACKBAR', action.msg);
			}
		}
	}
}

const snackbarstore = new SnackBarStore;
dispatcher.register(snackbarstore._handleActions.bind(snackbarstore));
export default snackbarstore;