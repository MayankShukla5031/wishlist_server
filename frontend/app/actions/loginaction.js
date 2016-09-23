import dispatcher from "../dispatchers/dispatcher";
import LoginWebApiUtils from "../utils/loginwebapiutils";

module.exports = {

	_userLogin : function(inpulvalues){
		// console.log('login', inpulvalues);
		LoginWebApiUtils._userLogin(inpulvalues);
	},

	_userRegistration : function(inpulvalues){
		// console.log('reg', inpulvalues);
		LoginWebApiUtils._userRegistration(inpulvalues);
	},

}