import dispatcher from "../dispatchers/dispatcher";
import LoginWebApiUtils from "../utils/loginwebapiutils";

module.exports = {

	_userRegistration : function(inpulvalues){
		// console.log('reg', inpulvalues);
		LoginWebApiUtils._userRegistration(inpulvalues);
	},

	_userLogin : function(inpulvalues){
		// console.log('login', inpulvalues);
		LoginWebApiUtils._userLogin(inpulvalues);
	},

	_userLogOut: function(){
		LoginWebApiUtils._userLogOut("");
	},

	_checkLogin: function(){
		LoginWebApiUtils._checkLogin();
	},

	_getUserInfo: function(){
		LoginWebApiUtils._getUserInfo("");
	}

}