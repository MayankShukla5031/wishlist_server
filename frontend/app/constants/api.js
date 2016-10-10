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
					xhr.setRequestHeader('token' ,this._getKey('token'));
				}
			},

	        success: (data,textStatus, jqXHR) => {
	        	if(jqXHR.getResponseHeader('Authorization')){
	        		this._setKey('token',jqXHR.getResponseHeader('Authorization'));
	        	}
	        	if(url == "login"){
	        		console.log("login", data.result.user_type);
	        		this._setKey('username', data.result.username);
	        		this._setKey('user_type', data.result.user_type);
	        	}
	        	target('success',data);        	
	        },
	        
	        error: (jqXhr,textStatus,error) => {
	        	// console.log('error plz api js', jqXhr,textStatus,error);
                if(jqXhr.status == 401){
                	// this._removeKey('token');
                	this._clearStorage();
                	hashHistory.push('/');
                	dispatcher.dispatch({
                		type: 'SNACKBAR',
                		msg: 'Kindly Login First'
                	});
                	dispatcher.dispatch({
                		type:'LOGOUT_SUCCESS'
                	});
                }else{
                	// this._removeKey('token');
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
		localStorage.setItem('wishlist.'+ key, value);
	},

	_getKey: function(key){
		let value = localStorage.getItem('wishlist.' + key);
		return value;
	},

	_removeKey: function(key){
		localStorage.removeItem('wishlist.' + key);
	},

	_clearStorage: function(){
		let len = localStorage.length;
		for (let i = len - 1; i >= 0; i--) {
            let key = localStorage.key(i);
            if (key != null && key != undefined && key.indexOf('wishlist.') == 0) {
                localStorage.removeItem(key);
            }
        }
	},
}