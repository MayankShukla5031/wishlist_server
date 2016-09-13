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
	        	console.log('success plz api.js', data,textStatus, jqXHR);
	        	target('success',data);        	
	        },
	        
	        error: (jqXhr,textStatus,error) => {
	        	console.log('error plz api js', jqXhr,textStatus,error);
                if(jqXhr.status == 401){
                }else{
	        		target('error',jqXhr,textStatus,error);
	        	}
	        }
		});
	},

	_setKey: function(key,value){
		localStorage.setItem('wishlist.'+ key, value);
	},

	_getKey: function(key){
		let value = localStorage.getItem('wishlist.' + key);
		return value;
	},
}