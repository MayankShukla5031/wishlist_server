import {hashHistory} from 'react-router';
import Api from '../constants/api';
import Url from '../constants/urls';
import dispatcher from "../dispatchers/dispatcher";

module.exports = {

	_userLogin : function(query){
		Api._callAPI(Url.LOGIN, 'post',query,(type,data)=> {
            if(type == 'success'){  
                dispatcher.dispatch({
                    type:'LOGIN_SUCCESS',
                });
            }
            else{   
                dispatcher.dispatch({
                    
                });
            }
	    });
	},

    _userRegistration : function(query){
        Api._callAPI(Url.USER_REGISTRATION, 'post',query,(type,data)=> {
            if(type == 'success'){  
                //console.log('success');           
                dispatcher.dispatch({
                    type:'USER_REG_SUCCESS',
                });
            }
            else{   
                //console.log('error');             
                dispatcher.dispatch({
                    
                });
            }
        });
    },

}