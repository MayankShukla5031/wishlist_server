import React from 'react';
import {hashHistory} from 'react-router';
import dispatcher from "../dispatchers/dispatcher";

import $ from 'jquery';
import BASEURL from '../../config';



module.exports ={

	_callAPI : function(url,method,data,target){
		// console.log('data', data);
		// data = this._addToken(data);
		$.ajax({
			url: BASEURL+url,
			method: method,
			data: data,
			processData: true,
			dataType: 'json',			
	        contentType: "application/x-www-form-urlencoded",

	        beforeSend: (xhr) => {
				if(this._getKey('token')){
					console.log('yes', xhr);
					xhr.setRequestHeader('token' ,this._getKey('token'));
					console.log('yes', xhr);
				}
			},

	        success: (data,textStatus, jqXHR) => {
	        	console.log('on succes', jqXHR, jqXHR.getResponseHeader('Authorization'));
	        	if(jqXHR.getResponseHeader('Authorization')){
	        		this._setKey('token',jqXHR.getResponseHeader('Authorization'));
	        	}
	        	target('success',data);        	
	        },
	        
	        error: (jqXhr,textStatus,error) => {
	        	// console.log('error plz api js', jqXhr,textStatus,error);
                if(jqXhr.status == 401){
                }else{
                	this._removeKey('token');
	        		target('error',jqXhr,textStatus,error);
	        	}
	        }
		});
	},

	// _addToken(data){
	// 	// return data;
	// 	let token = this._getKey('token');
	// 	console.log('tken', token);
	// 	if(token){
	// 		data['token'] = token;
	// 	}
	// 	return data;
	// },

	_setKey: function(key,value){
		// console.log('set key', key, value);
		localStorage.setItem('wishlist.'+ key, value);
	},

	_getKey: function(key){
		let value = localStorage.getItem('wishlist.' + key);
		return value;
	},

	_removeKey: function(key,value){
		localStorage.removeItem('wishlist.' + key);
	},

	_clearStorage: function(){
		let len = localStorage.length;
		for (let i = len - 1; i >= 0; i--) {
            let key = localStorage.key(i);
            if (key != null && key != undefined && key.indexOf('happay.') == 0) {
                localStorage.removeItem(key);
            }
        }
	},
}