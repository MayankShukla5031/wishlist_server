import {hashHistory} from 'react-router';
import Api from '../constants/api';
import Url from '../constants/urls';
import dispatcher from "../dispatchers/dispatcher";

module.exports = {

	_getMyWishList : function(query){
		Api._callAPI(Url.GET_WISHLIST,'get',query,(type,data)=> {
	            if(type == 'success'){  
	            	//console.log('success');           
	                dispatcher.dispatch({
	                    type:'MyWishList',
	                    data: data,
	                });
	            }
	            else{   
	            	//console.log('error');             
	                dispatcher.dispatch({
	                    
	                });
	            }
	    });
	},

	_addToWishList : function(query){
		Api._callAPI(Url.ADD_TO_WISHLIST,'post',query,(type,data)=> {
            if(type == 'success'){   
            	console.log('success add to MyWishList'); 
                dispatcher.dispatch({
                	type: 'ADD_TO_WISHLIST_SUCCESS',                	
                });
            }
            else{   
            	//console.log('error');             
                dispatcher.dispatch({
                    
                });
            }
	    });
	},

	_removeFromWishList : function(query){
		Api._callAPI(Url.REMOVE_FROM_WISHLIST,'post',query,(type,data)=> {
            if(type == 'success'){   
            	console.log('success remove from MyWishList');
                dispatcher.dispatch({
                    type: 'REMOVE_FROM_WISHLIST_SUCCESS',
                });
            }
            else{   
            	//console.log('error');             
                dispatcher.dispatch({
                    
                });
            }
	    });
	},

	_addToMyShows : function(query){
		Api._callAPI(Url.ADD_SHOW,'post',query,(type,data)=> {
            if(type == 'success'){   
                dispatcher.dispatch({
                    type: 'MOVIE_ADDED_IN_MYSHOWS',
                });
            }
            else{   
            	//console.log('error');             
                dispatcher.dispatch({
                    type: 'snackbar',
                    str: "something went wrong"
                });
            }
	    });
	}

}