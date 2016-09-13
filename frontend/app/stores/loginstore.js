import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";

class LoginStore extends EventEmitter{
	constructor(){
		super();
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
		}
	}
}

const loginstore = new LoginStore;
dispatcher.register(loginstore._handleActions.bind(loginstore));
export default loginstore;

