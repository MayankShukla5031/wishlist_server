import {hashHistory} from 'react-router';
import Api from '../constants/api';
import Url from '../constants/urls';
import dispatcher from "../dispatchers/dispatcher";

module.exports = {

	_searchMovie : function(query){
		

		var newQuery= {};

		if(query['Title'])
		{
			newQuery.title=query['Title'];
		}
		else if(query['Actor'])
		{
			newQuery.actor=query['Actor'];
		}
		else if(query['Director'])
		{
			newQuery.director=query['Director'];
		}
		else if(query['Producer'])
		{
			newQuery.producer=query['Producer'];
		}
		else if(query['Music Director'])
		{
			newQuery.music_director=query['Music Director'];
		}
		else if(query['Production House'])
		{
			newQuery.production_house=query['Production House'];
		}
		 
		console.log(newQuery);

		Api._callAPI(Url.SEARCH,'get',newQuery,(type,data)=> {
	            if(type == 'success'){  
	            	//console.log('success');           
	                dispatcher.dispatch({
	                    type:'MOVIE_SEARCH_RESULTS',
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