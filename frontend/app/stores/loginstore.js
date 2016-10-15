import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";

class LoginStore extends EventEmitter{
	constructor(){
		super();
		this.showLoader = false;
	}

	_setLoaderValue(value){
		this.showLoader = value;
		this.emit('change', 'Loader');
	}

	_getLoaderValue(){
		return this.showLoader;
	}
	

	_handleActions(action){
		switch(action.type){
			case 'LOGIN_SUCCESS' : {
				this.emit('change', 'Login_Success');
				break;
			}
			case 'USER_REG_SUCCESS': {
				this.emit('change', 'User_Reg_Success');
				break;
			}
			case 'LOGOUT_SUCCESS': {
				this.emit('change', 'Logout');
				break;
			}
			case 'Logged_In_Last_Time': {
				this.emit('change', 'Logged_In_Last_Time');
				break;
			}
			case 'LOADER': {
				console.log('LoginStore', action.value);
				this._setLoaderValue(action.value);
				break;
			}
		}
	}
}

const loginstore = new LoginStore;
dispatcher.register(loginstore._handleActions.bind(loginstore));
export default loginstore;

