import {hashHistory} from 'react-router';
import Api from '../constants/api';
import Url from '../constants/urls';
import dispatcher from "../dispatchers/dispatcher";

module.exports = {

	_getUpcomingShowsList : function(query){
		Api._callAPI(Url.UPCOMING_SHOWS, 'get',query,(type,data)=> {
            if(type == 'success'){  
                dispatcher.dispatch({
                    type:'UPCOMING_SHOWS',
                    data: data
                });
            }
            else{   
                dispatcher.dispatch({
                    type: 'SNACKBAR',
                    msg:  data.responseJSON.result || 'Something went wrong, Kindly try after some time'
                });
            }
	    });
	},


}