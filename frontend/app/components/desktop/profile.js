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
import LoginStore from '../../stores/loginstore';

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
			openCreateScreenDialogue: false,
			screenName: '',
			cityName: '',
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
		if(type == 'User_Info'){
		 	let userInfo = LoginStore._getUserInfo();
			this.setState({
				userInfo: userInfo,
			});
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
		if(row == "" || column == ""){
			return null;
		}
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
		let layout = {rows: this.state.rowCount, columns: this.state.columnCount};
		let data = {name: this.state.screenName, addresss: this.state.cityName, no_of_seats: 120, layout: JSON.stringify(layout)}
		MovieDetailsAction._addScreen(data);
	}

	_handleRemoveScreen(screen_id){
		let data = {screen_id: screen_id};
		MovieDetailsAction._removeScreen(data);
	}

	_handleEditScreen(){
		this.setState({
			openCreateScreenDialogue: true,
		});
	}

	_setScreenNames(){
		let screens = this.state.userInfo.screens || [];
		console.log('screens', screens);
		let uiItems = screens.map((item, index)=>{
			return(<Paper style={{marginBottom: '10px'}}>
					<Grid>
						<Cell col={12}>
							{item.uid}
							<FlatButton style={styles.saveButtonStyle, {float: 'right'}} label="Edit/View Screen Layout" primary={true} onTouchTap={this._handleEditScreen.bind(this)} />
							<FlatButton style={styles.saveButtonStyle, {float: 'right'}} label="Remove Screen" primary={true} onTouchTap={this._handleRemoveScreen.bind(this, item.uid)} />
						</Cell>
					</Grid>
				</Paper>
			);
		});
		if(!uiItems.length){
			uiItems.push(<Paper style={{marginBottom: '10px'}}><Grid><Cell col={12}><p>No Saved Screen Found</p></Cell></Grid></Paper>);
		}
		return uiItems;
	}

	_handleCreateScreenDialogCancel(){
		this.setState({
			openCreateScreenDialogue: false,
		});
	}

	_handleAddNewScreenClick(){
		this.setState({
			openCreateScreenDialogue: true,
			screenName: '',
			cityName: '',
			rowCount: '',
			columnCount: '',
		});
	}

	render(){

		const CreateScreenActionOption = [
			<FlatButton style={styles.saveButtonStyle} label="Create Screen" primary={true} onTouchTap={this._handleAddScreen.bind(this)} />,
			<FlatButton style={styles.saveButtonStyle} label="Cancel" primary={true} onTouchTap={this._handleCreateScreenDialogCancel.bind(this)} />
		];

		return(
			<div>
			{Api._getKey('user_type') && Api._getKey('user_type') != 'viewer' ?
				<Dialog
                    title="Create Screen"
                    actions={CreateScreenActionOption}
                    modal={false}
                    open={this.state.openCreateScreenDialogue}
                    autoScrollBodyContent = {true}
                    onRequestClose={this._handleCreateScreenDialogCancel.bind(this)}
                    // bodyStyle={Style.AuthorizeTransaction.bodyStyle}
                    // actionsContainerStyle={Style.AuthorizeTransaction.actionStyle}
                >
                    <Grid>
                    	<Cell col={6}>
							<TextField
								hintText="e.g- PVR"
	                            floatingLabelText="Screen Name"
	                            floatingLabelStyle={styles.floatingLabelStyle}
	                            value={this.state.screenName}
	                            onChange={(event, value)=>{this.setState({screenName: value});}}        
							/>
						</Cell>
						 <Cell col={6}>
							<TextField
								hintText="e.g- Hyderabad"
	                            floatingLabelText="City Name"
	                            floatingLabelStyle={styles.floatingLabelStyle}
	                            value={this.state.cityName}
	                            onChange={(event, value)=>{this.setState({cityName: value});}}        
							/>
						</Cell>
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
						{this._setTheatreLayout()}
					</Grid>
                </Dialog>
                : "" 
            }
				<Grid>
					<Cell col={12}>
						<p>User Details</p>
						<Paper>
							<Grid>
								<Cell col={12}>User Name: {this.state.userInfo.username || "Hello"}</Cell>
							</Grid>							
						</Paper>
					</Cell>
					{Api._getKey('user_type') && Api._getKey('user_type') != 'viewer' ?
						<Cell col={12}>
							<p>Screens</p>
							{this._setScreenNames()}
							<FlatButton style={styles.saveButtonStyle} label="Add New Screen" primary={true} onTouchTap={this._handleAddNewScreenClick.bind(this)} />
						</Cell>
						: 
						null
					}
				</Grid>
			</div>
		);	
	}
}

