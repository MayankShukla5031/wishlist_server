import React from 'react';
import {hashHistory} from 'react-router';
import dispatcher from "../dispatchers/dispatcher";

import $ from 'jquery';
import BASEURL from '../../config';



module.exports ={
	_callAPI : function(url,method,data,target){
		$.ajax({
			url: BASEURL+url,
			method: method,
			data: data,
			processData: true,
			dataType: 'json',			
	        contentType: "application/x-www-form-urlencoded",

	        success: (data,textStatus, jqXHR) => {
	        	console.log('success plz', data,textStatus, jqXHR);
	        	target('success',data);        	
	        },
	        
	        error: (jqXhr,textStatus,error) => {
	        	console.log('error plz', jqXhr,textStatus,error);
                if(jqXhr.status == 401){
                }else{
	        		target('error',jqXhr,textStatus,error);
	        	}
	        }
		});
	},
}