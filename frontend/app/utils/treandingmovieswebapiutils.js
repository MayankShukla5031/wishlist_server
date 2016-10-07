import {hashHistory} from 'react-router';
import Api from '../constants/api';
import Url from '../constants/urls';
import dispatcher from "../dispatchers/dispatcher";

module.exports = {

	_getTreandingMoviesList : function(query){
		Api._callAPI(Url.TRENDING_MOVIE,'get',query,(type,data)=> {
	            if(type == 'success'){  
	            	// console.log('success');           
	                dispatcher.dispatch({
	                    type:'TRENDING_MOVIES',
	                    data: data,
	                });
	            }
	            else{            	         
	                dispatcher.dispatch({
	                    
	                });
	            }
	    });
	},

}