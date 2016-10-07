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

}