import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";

class LoginStore extends EventEmitter{
	constructor(){
		super();
		this.showLoader = false;
		this.UserInfo = [];
	}

	_setLoaderValue(value){
		this.showLoader = value;
		this.emit('change', 'Loader');
	}

	_getLoaderValue(){
		return this.showLoader;
	}

	_setUserInfo(value, emitString){
		this.UserInfo = value;
		this.emit('change', emitString);
		// console.log('emitted', value);
	}

	_getUserInfo(){
		// console.log('info', this.UserInfo);
		return this.UserInfo;
	}
	

	_handleActions(action){
		switch(action.type){
			case 'LOGIN_SUCCESS' : {
				this._setUserInfo(action.data, 'Login_Success');
				// this.emit('change', 'Login_Success');
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
				// console.log('LoginStore', action.value);
				this._setLoaderValue(action.value);
				break;
			}
			case 'USER_INFO': {
				// console.log('store data');
				this._setUserInfo(action.data, 'User_Info');
				break;
			}
		}
	}
}

const loginstore = new LoginStore;
dispatcher.register(loginstore._handleActions.bind(loginstore));
export default loginstore;

