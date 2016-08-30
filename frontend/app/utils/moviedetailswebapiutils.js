import {hashHistory} from 'react-router';
import Api from '../constants/api';
import Url from '../constants/urls';
import dispatcher from "../dispatchers/dispatcher";

module.exports = {

	_getMovieDetails : function(query){
		Api._callAPI(Url.GET_MOVIE_DETAILS,'get',query,(type,data)=> {
            if(type == 'success'){  
            	//console.log('success');           
                dispatcher.dispatch({
                    type:'MOVIE_DETAILS',
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

	// _addToWishList : function(query){
	// 	Api._callAPI(Url.ADD_TO_WISHLIST,'post',query,(type,data)=> {
 //            if(type == 'success'){   
 //            	console.log('success'); 
 //            	alert('movie added successfully');        
 //                dispatcher.dispatch({
                    
 //                });
 //            }
 //            else{   
 //            	console.log('error');             
 //                dispatcher.dispatch({
                    
 //                });
 //            }
	//     });
	// },

	// _removeFromWishList : function(query){
	// 	Api._callAPI(Url.REMOVE_FROM_WISHLIST,'post',query,(type,data)=> {
 //            if(type == 'success'){   
 //            	console.log('success');
 //            	alert('movie removed successfully');         
 //                dispatcher.dispatch({
                    
 //                });
 //            }
 //            else{   
 //            	console.log('error');             
 //                dispatcher.dispatch({
                    
 //                });
 //            }
	//     });
	// },

}