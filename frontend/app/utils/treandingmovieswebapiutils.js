import {hashHistory} from 'react-router';
import Api from '../constants/api';
import Url from '../constants/urls';
import dispatcher from "../dispatchers/dispatcher";

module.exports = {

	_getTreandingMoviesList : function(query){
		Api._callAPI(Url.SEARCH,'get',query,(type,data)=> {
	            if(type == 'success'){  
	            	//console.log('success');           
	                dispatcher.dispatch({
	                    type:'MOVIES',
	                    data: data,
	                });
	            }
	            else{   
	            	console.log('error');             
	                dispatcher.dispatch({
	                    
	                });
	            }
	    });
	},

}