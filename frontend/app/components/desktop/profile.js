import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Grid, Cell} from 'react-mdl';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import Checkbox from 'material-ui/Checkbox';
// import ActionFavorite from 'material-ui/svg-icons/action/favorite';
// import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
// import Visibility from 'material-ui/svg-icons/action/visibility';
// import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';

import Api from '../../constants/api';
import LoginStore from '../stores/loginstore';

import * as MovieDetailsAction from '../../actions/moviedetailsaction';
import * as MyWishListAction from '../../actions/mywishlistaction';
import MovieDetailsStore from '../../stores/moviedetailsstore';
import MyWishListStore from '../../stores/mywishliststore';

const styles = {
	saveButtonStyle:{
		backgroundColor: '#77ADFC',
		color: 'white',
		cursor: 'pointer',
		marginRight: '10px',
	},
	leftMargin: {
		marginLeft: '10%',
	},
	SearchFieldFontStyling: {
        width: '20%',
        fontSize: '14px',
        padding : '0px',
        fontWeight: 'normal',
        marginLeft: '20px'
    },
    floatingLabelStyle:{
        fontSize: '14px',
        fontWeight: 'normal',
        padding: '0px'
    },
    cancelButtonStyle: {
        backgroundColor: '#ffffff',
        color: 'black'

    },
    checkbox:{
    	display: 'inline-block',
    	width: '100px',
    }
}


export default class Profile extends React.Component{
	constructor(){
		super();
		this.state = {
			rowCount: '',
			columnCount:'',
			openLayout: false,
			seats: {},
			userInfo: LoginStore._getUserInfo() || {},
		};
		this._loginStoreChange = this._loginStoreChange.bind(this);
	}

	componentWillMount(){
		LoginStore.on('change',this._loginStoreChange); 
		// MyWishListStore.on('change', this._getWishListStoreData);
	}

	componentWillUnmount(){
		 LoginStore.removeListener('change', this._loginStoreChange);
		// MovieDetailsStore.removeListener('change', this._getMovieDetailsfromStore);
	}	

	_loginStoreChange(type){
		 if(type == 'Login_Success'){
		 }
	}

	_handleRowCountChange(event, value){
		if(!isNaN(value)){
			this.setState({
				rowCount: value
			});
		}
	}

	_handleColumnCountChange(event, value){
		if(!isNaN(value)){
			this.setState({
				columnCount: value
			});
		}
	}

	_handleOpenLayoutClick(){
		this.setState({
			openLayout: true,
		});
	}

	_setTheatreLayout(){
		let row = this.state.rowCount;
		let column = this.state.columnCount;
		let uiItems = [];
		for(let i = 0; i < row; i++){
			for(let j = 0; j < column; j++){
				uiItems.push(
					<Checkbox
						key={i + "-" + String.fromCharCode('a'.charCodeAt()+j)}
						label={i + "-" + String.fromCharCode('a'.charCodeAt()+j)}
				    	style={styles.checkbox}
				    	onCheck={this._handleSeatClick.bind(this,i,j)}
				    />						
				);
			}
			uiItems.push(<br/>);
		}
		
			// uiItems.push(
			// 		<ul>
			// 			<li>
			// 				<Checkbox
			// 					label={'a'.charCodeAt()+j}
			// 			    	style={styles.checkbox}
			// 			    />
			// 			</li>
			// 			<li>{'a'.charCodeAt()+j}<li>
			// 	);
		return uiItems;
	}

	_handleSeatClick(row, column, event, isInputChecked){
		// console.log('onclick seats', row, column, isInputChecked);
		// let seats = this.state.seats;
		// console.log(seats);
		// seats[row][column] = isInputChecked ? 1 : 0;
		// this.setState({
		// 	seats : seats,
		// });
	}

	_handleAddScreen(){
		let layout = {rows: 10, columns: 10};
		let data = {name: 'ABC', addresss: 'Bangalore', no_of_seats: 120, layout: JSON.stringify(layout)}
		MovieDetailsAction._addScreen(data);
	}

	_handleRemoveScreen(){
		let data = {screen_id: 'SCR10000019'};
		MovieDetailsAction._removeScreen(data);
	}

	_setScreenNames(){
		let screens = this.state.userInfo.screens || [];
		let uiItems = screens.map((item, index)=>{
			<Cell col={12}>
				{item}
				<FlatButton style={styles.saveButtonStyle} label="Remove Screen" primary={true} onTouchTap={this._handleRemoveScreen.bind(this)} />
			</Cell>
		});
	}

	render(){
		return(
				<Grid>
					<Cell col={12}>
						User Details
						<Paper>
							User Name: {this.state.userInfo.username || "Hello"}							
						</Paper>
					</Cell>
					{Api._getKey('user_type') != 'viewer' ?
						<Cell col={12}>
							Screens
							<Paper>
								<Grid>
									{this._setScreenNames()}
								</Grid>
							</Paper>
						</Cell>
					}
					<Cell col={6}>
						<TextField
							hintText="e.g- 100"
                            floatingLabelText="No of Rows"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            value={this.state.rowCount}
                            onChange={this._handleRowCountChange.bind(this)}        
						/>
					</Cell>
					<Cell col={6}>
						<TextField
							hintText="e.g- 100"
                            floatingLabelText="No of Columns"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            value={this.state.columnCount}
                            onChange={this._handleColumnCountChange.bind(this)}        
						/>
					</Cell>
					<Cell col={12}>
						<FlatButton style={styles.saveButtonStyle} label="Preview Layout" primary={true} onTouchTap={this._handleOpenLayoutClick.bind(this)} />
						<FlatButton style={styles.saveButtonStyle} label="Add Screen" primary={true} onTouchTap={this._handleAddScreen.bind(this)} />
						<FlatButton style={styles.saveButtonStyle} label="Remove Screen" primary={true} onTouchTap={this._handleRemoveScreen.bind(this)} />
						<br/>
						{this.state.openLayout ?
							this._setTheatreLayout()
						: ""}
					</Cell>
				</Grid>
		);	
	}
}

