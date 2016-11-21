import {hashHistory} from 'react-router';
import Api from '../constants/api';
import Url from '../constants/urls';
import dispatcher from "../dispatchers/dispatcher";

module.exports = {

	_userLogin : function(query){
        dispatcher.dispatch({
            type: 'LOADER',
            value: true,
        });
		Api._callAPI(Url.LOGIN, 'post',query,(type,data)=> {
            if(type == 'success'){  
                dispatcher.dispatch({
                    type:'LOGIN_SUCCESS',
                    data: data,
                });
            }
            else{   
                dispatcher.dispatch({
                    type: 'SNACKBAR',
                    msg:  data.responseJSON.result || 'Something went wrong, Kindly try after some time'
                });
            }
	    });
        dispatcher.dispatch({
            type: 'LOADER',
            value: false,
        });
	},

    _userRegistration : function(query){
        dispatcher.dispatch({
            type: 'LOADER',
            value: true,
        });
        Api._callAPI(Url.USER_REGISTRATION, 'post',query,(type,data)=> {
            if(type == 'success'){  
                //console.log('success');           
                dispatcher.dispatch({
                    type:'USER_REG_SUCCESS',
                });
            }
            else{  
                // console.log('data', data.responseJSON.result); 
                dispatcher.dispatch({
                    type: 'SNACKBAR',
                    msg: data.responseJSON.result || "Something went wrong, kindly try after sometime"
                });
            }
        });
        dispatcher.dispatch({
            type: 'LOADER',
            value: false,
        });
    },

    _userLogOut: function(query){
        dispatcher.dispatch({
            type: 'LOADER',
            value: true,
        });
        Api._callAPI(Url.LOG_OUT, 'post',query,(type,data)=> {
            if(type == 'success'){
                hashHistory.push('/');
                // Api._removeKey('token');
                Api._clearStorage();
                dispatcher.dispatch({
                    type: 'LOGOUT_SUCCESS',                   
                });
            }else{
                dispatcher.dispatch({
                    type: 'SNACKBAR',
                    msg: 'Something went wrong, Kindly try after some time'
                });
            }
        });
        dispatcher.dispatch({
            type: 'LOADER',
            value: false,
        });       
    },  

    _checkLogin: function(){
        let type;
        let token = Api._getKey('token');
        if(token){
            dispatcher.dispatch({
                type: "Logged_In_Last_Time",
            });
        }        
    },

    _getUserInfo(query){
        let token = Api._getKey('token');
        if(token){
            Api._callAPI(Url.USER_INFO, 'get',query,(type,data)=> {
                if(type == 'success'){
                    dispatcher.dispatch({
                        type: 'USER_INFO',   
                        data: data,                
                    });
                }else{
                   
                }
            });
        }   
    }

}