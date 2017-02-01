import {hashHistory} from 'react-router';
import Api from '../constants/api';
import Url from '../constants/urls';
import dispatcher from "../dispatchers/dispatcher";

module.exports = {

	_getMovieDetails : function(query){
        dispatcher.dispatch({
            type: 'LOADER',
            value: true,
        });
		Api._callAPI(Url.GET_MOVIE_DETAILS,'get',query,(type,data)=> {
            if(type == 'success'){  
                dispatcher.dispatch({
                    type:'MOVIE_DETAILS',
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

    _cancelMyShow : function(query){
        dispatcher.dispatch({
            type: 'LOADER',
            value: true,
        });
        Api._callAPI(Url.CANCEL_SHOW,'post',query,(type,data)=> {
            if(type == 'success'){  
                hashHistory.push('/myshows');
            }
            else{   
                // dispatcher.dispatch({
                //     type: 'SNACKBAR',
                //     msg:  data.responseJSON.result || 'Something went wrong, Kindly try after some time'
                // });
            }
            dispatcher.dispatch({
                type: 'LOADER',
                value: false,
            });
        });       
    },

    _addScreen: function(query){
        Api._callAPI(Url.ADD_SCREEN,'post',query,(type,data)=> {
            if(type == 'success'){  
                dispatcher.dispatch({
                    type: 'SNACKBAR',
                    msg:  "Screen added successfully"
                });
                this._getUserInfo("");
                dispatcher.dispatch({
                    type: 'ADD_SCREEN_SUCCESS',
                });
            }
            else{   
                dispatcher.dispatch({
                    type: 'SNACKBAR',
                    msg:  "Something went wrong, Kindly try after some time"
                });
            }
        });
    },

    _removeScreen(query){
        Api._callAPI(Url.REMOVE_SCREEN,'post',query,(type,data)=> {
            if(type == 'success'){  
                dispatcher.dispatch({
                    type: 'SNACKBAR',
                    msg:  "Screen removed successfully"
                });
                this._getUserInfo("");
            }
            else{   
                dispatcher.dispatch({
                    type: 'SNACKBAR',
                    msg:  "Something went wrong, Kindly try after some time"
                });
            }
        });
    },

    _getUserInfo(query){
        let token = Api._getKey('token');
        if(token){
            Api._callAPI(Url.USER_INFO, 'get',query,(type,data)=> {
                if(type == 'success'){
                    dispatcher.dispatch({
                        type: 'USER_INFO',   
                        data: data.result,                
                    });
                }else{
                   
                }
            });
        }   
    },

    _getScreenDetails(query){
        Api._callAPI(Url.GET_MOVIE_DETAILS,'GET',query,(type,data)=> {
            if(type == 'success'){  
                dispatcher.dispatch({
                    type: 'SCREEN_DETAILS',
                    data:  data,
                });
            }else{   
                dispatcher.dispatch({
                    type: 'SNACKBAR',
                    msg:  "Something went wrong, Kindly try after some time"
                });
            }
        });
    },

    _getLayout(query){
        Api._callAPI(Url.GET_SCREEN_LAYOUT,'GET',query,(type,data)=> {
            if(type == 'success'){  
                dispatcher.dispatch({
                    type: 'SCREEN_LAYOUT_DETAILS',
                    data:  data,
                });
            }else{   
                dispatcher.dispatch({
                    type: 'SNACKBAR',
                    msg:  "Something went wrong, Kindly try after some time"
                });
            }
        });
    },

    _bookTicket(query){
        Api._callAPI(Url.BOOK_TICKET,'post',query,(type,data)=> {
            if(type == 'success'){  
                dispatcher.dispatch({
                    type: 'TICKET_BOOKED',
                    //data:  data,
                });
            }else{   
                dispatcher.dispatch({
                    type: 'SNACKBAR',
                    msg:  "Something went wrong, Kindly try after some time"
                });
            }
        });  
    }
}