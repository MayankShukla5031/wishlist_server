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

    _userLogOut: function(query){
        Api._callAPI(Url.LOG_OUT, 'post',query,(type,data)=> {
            if(type == 'success'){
                console.log('success');
                Api._removeKey('token');
                hashHistory.push('/');
            }else{
                console.log('success');
                dispatcher.Dispatch({
                    type: 'SNACKBAR',
                    msg: 'Something went wrong, Kindly try after some time'
                });
            }
        });       
    },

    _checkLogin: function(){
        let type;
        console.log('yes');
        let token = Api._getKey('token');
        if(token){
            console.log('token');
            dispatcher.dispatch({
                type: "Logged_In_Last_Time",
            });
        }        
    },

}