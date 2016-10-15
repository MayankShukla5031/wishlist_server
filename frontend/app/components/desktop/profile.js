// import React from 'react';
// import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
// import {Grid, Cell} from 'react-mdl';
// import Dialog from 'material-ui/Dialog';
// import Paper from 'material-ui/Paper';
// import FlatButton from 'material-ui/FlatButton';
// import TextField from 'material-ui/TextField';

// import Api from '../constants/api';

// import * as MovieDetailsAction from '../actions/moviedetailsaction';
// import * as MyWishListAction from '../actions/mywishlistaction';
// import MovieDetailsStore from '../stores/moviedetailsstore';
// import MyWishListStore from '../stores/mywishliststore';

// const styles = {
// 	saveButtonStyle:{
// 		backgroundColor: '#77ADFC',
// 		color: 'white',
// 		marginLeft: '20px',
// 		cursor: 'pointer',
// 		marginLeft: '10%',
// 	},
// 	leftMargin: {
// 		marginLeft: '10%',
// 	},
// 	SearchFieldFontStyling: {
//         width: '20%',
//         fontSize: '14px',
//         padding : '0px',
//         fontWeight: 'normal',
//         marginLeft: '20px'
//     },
//     floatingLabelStyle:{
//         fontSize: '14px',
//         fontWeight: 'normal',
//         padding: '0px'
//     },
//     cancelButtonStyle: {
//         backgroundColor: '#ffffff',
//         color: 'black'

//     },
// }


// export default class TrendingMovies extends React.Component{
// 	constructor(){
// 		super();
// 		this.state = {
// 		};
// 	}

// 	componentWillMount(){
// 		MyWishListStore.on('change', this._getWishListStoreData);
// 	}

// 	componentWillUnmount(){
// 		MovieDetailsStore.removeListener('change', this._getMovieDetailsfromStore);
// 		MyWishListStore.removeListener('change', this._getWishListStoreData);
// 	}

// 	componentWillReceiveProps(newKey){
// 		MovieDetailsAction._getMovieDetails({id: newKey.params.movieId});
// 	}

	

// 	render(){
		
// 	}
// }

