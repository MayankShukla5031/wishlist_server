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
    }

}