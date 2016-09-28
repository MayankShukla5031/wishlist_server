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
			case 'LOGOUT_SUCCESS': {
				this.emit('change', 'Logout');
			}
			case 'Logged_In_Last_Time': {
				console.log('recieved');
				this.emit('change', 'Logged_In_Last_Time');
			}
		}
	}
}

const loginstore = new LoginStore;
dispatcher.register(loginstore._handleActions.bind(loginstore));
export default loginstore;

