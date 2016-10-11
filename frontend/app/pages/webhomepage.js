import React from 'react';
import {Link} from 'react-router';

import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Grid, Cell, Layout, Header, HeaderRow, Navigation, Drawer, Content, Icon, Textfield} from 'react-mdl';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import SelectField from 'material-ui/SelectField';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

import Api from '../constants/api';

import * as LoginAction from '../actions/loginaction';
import * as MovieSearchAction from '../actions/moviesearchaction';

import LoginStore from '../stores/loginstore';
import MoviesSearchStore from '../stores/moviessearchstore';
import SnackBarStore from '../stores/snackbarstore';

const styles = {

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
    saveButtonStyle:{
        backgroundColor: '#77ADFC',
        color: 'white',
    },

};


export default class HomePage extends React.Component {
    constructor(){
        super();
        this.state = {
            filterValue : 'title',
            // userTypeValue: 'viewer',
            searchString: '',
            searchResultOpen: false,
            openUserOption: false,
            movieList: [],
            anchorLogin: '',
            isRegister: true,
            openLoginDialogue: false,
            isLoggedin: false,
            loginData: {},
            openSnackBar: false,
            snackbarMsg: '',
            userType : null,
        };
        this._getMovieList = this._getMovieList.bind(this);
        this._loginStoreChange = this._loginStoreChange.bind(this);
        this._snackbarStoreChange = this._snackbarStoreChange.bind(this);
        this._handleLoginDialogCancel = this._handleLoginDialogCancel.bind(this);
        this._handleLoginDialogSubmit = this._handleLoginDialogSubmit.bind(this);
        this._handleRequestClose = this._handleRequestClose.bind(this);
    }

    componentWillMount(){
        LoginStore.on('change',this._loginStoreChange); 
        MoviesSearchStore.on('change',this._getMovieList); 
        SnackBarStore.on('change', this._snackbarStoreChange);
        LoginAction._checkLogin();
    }

    componentWillUnmount(){
        LoginStore.removeListener('change', this._loginStoreChange);
        MoviesSearchStore.removeListener('change', this._getMovieList);
        SnackBarStore.removeListener('change', this._snackbarStoreChange);
    }
    
    _getMovieList(type){
        if(type == "MovieSearchResults"){
            let movieList = MoviesSearchStore._getMovieList();
            console.log('movie', movieList);
            this.setState({movieList : movieList});
        }
    }

    _loginStoreChange(type){
        if(type == 'Login_Success'){
            let userType = Api._getKey('user_type');
            console.log('user_type', userType);
            this.setState({
                isLoggedin: true,
                openLoginDialogue: false,
                userType: userType ? userType : null,
            });
        }else if(type == 'User_Reg_Success'){
            this.setState({
                isRegister: true,
                loginData: {}
            });
        }else if(type == 'Logout'){
            this.setState({
                isLoggedin: false,
                // openUserOption: false,
            });
        }else if(type == 'Logged_In_Last_Time'){
            this.setState({isLoggedin: true});
        }
    }

    _snackbarStoreChange(type, str){
        if(type == 'SNACKBAR'){
            this.setState({
                openSnackBar: true,
                snackbarMsg: str,
            });
        }
    }

    _handleFilterChange(event, index, value){
        this.setState({
            filterValue : value
        });
    }

    _handleSearchChange(event, value){
        let query = {};
        query[this.state.filterValue] = event.target.value;
        MovieSearchAction._searchMovie(query);
        this.setState({searchString: value, anchorSearchResult: event.target, searchResultOpen: true});
        
    }

    _handleSearchResultClose(){
        this.setState({searchResultOpen : false});
    }

    _showMoviesName(){
        let temp = this.state.movieList;
            return(
                temp.map(function(result, index){
                    return(
                       <MenuItem key={index} value={result.uid} primaryText='' style = {{'fontSize': '15px'}} containerElement={<Link to={`/moviedetails/${result.uid}`}/>}><img src={result.poster_url} alt="" style={{width: '35px', height: 'auto', margin:'5px'}}/>{result.title}</MenuItem>
                )
            })
        );
    }

    _openUserOption(event){
        // console.log(event.target);
        this.setState({
            anchorUserOption: event.target, 
            openUserOption: true,
        });
    }

    _handleUserOptionClose(){
        this.setState({
            openUserOption: false,
        });
    }

    _showMovieDetails(event, menuItem, index){
        console.log('id' , menuItem.props.value, index);
    }

    _openLoginDialogue(){
        this.setState({
            openLoginDialogue : true,
            openUserOption: false,
            loginData: {}
        });
    }

    _handleLoginDialogCancel(){
        this.setState({
            openLoginDialogue: false,
        });
    }

    _handleCommonLoginChange(type, event, value, index){
        if(type == "user_type"){
            value = index;
            console.log('va', value);
        }
        let loginData = this.state.loginData;
        loginData[type] = value;
        this.setState({
            loginData: loginData,
        });
    }

    _changeLoginUi(type){
        let user;
        if(type == 'oldUser'){
             user = true; 
        }else{
            user = false;
        }

        this.setState({
            isRegister: user,
            loginData: {}
        });
    }

    _setLoginDialogueUi(){
        if(!this.state.isRegister){
            return(
                <Grid>
                   <Cell col={12}>
                        <TextField
                            hintText="e.g- abc"
                            floatingLabelText="User Name"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            fullWidth={true}
                            value={this.state.loginData.username || ''}
                            onChange={this._handleCommonLoginChange.bind(this, 'username')}                                  
                        />
                    </Cell>
                    <Cell col={12}>
                        <TextField
                            hintText="e.g- 1234567890"
                            floatingLabelText="Mobile Number"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            fullWidth={true}
                            value={this.state.loginData.phone_number || ''}
                            onChange={this._handleCommonLoginChange.bind(this, 'phone_number')}                                  
                        />
                    </Cell>
                     <Cell col={12}>
                         <TextField
                            hintText="e.g- abc@xyz.com"
                            floatingLabelText="Mail Id"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            fullWidth={true}
                            value={this.state.loginData.email_id || ''}
                            onChange={this._handleCommonLoginChange.bind(this, 'email_id')}                                  
                        />
                    </Cell>
                     <Cell col={12}>
                        <TextField
                            type="password"
                            hintText="*****"
                            fullWidth={true}
                            floatingLabelText="Password"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            value={this.state.loginData.password || ''}
                            onChange={this._handleCommonLoginChange.bind(this, 'password')}                                  
                        />
                    </Cell>
                    <Cell col={12}>
                        <SelectField
                            autoWidth={true}
                            labelStyle={{padding: '0px'}} 
                            floatingLabelStyle={styles.floatingLabelStyle}
                            value={this.state.loginData.user_type || ""}
                            onChange={this._handleCommonLoginChange.bind(this, 'user_type')}
                            floatingLabelText="Select Type"
                        >                                    
                            <MenuItem key={1} value="viewer" primaryText="Viewer" />
                            <MenuItem key={2} value="theatre" primaryText="Theatre" />
                        </SelectField>
                    </Cell>
                   {/* <Cell col={12}>
                        <p style={{float: 'right', cursor: 'pointer'}} onClick={this._changeLoginUi.bind(this, 'oldUser')}>Already have a Account</p>
                    </Cell>*/}
                </Grid>
            );
        }else{
            return(
                <Grid>
                    <Cell col={12}>
                        <TextField
                           fullWidth={true}
                            hintText="e.g- abc"
                            floatingLabelText="User Name or Mobile Number or Mail Id"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            value={this.state.loginData.user || ''}
                            onChange={this._handleCommonLoginChange.bind(this, 'user')}                                  
                        />
                    </Cell>
                    <Cell col={12}>
                        <TextField
                            type="password"
                            hintText="*****"
                            fullWidth={true}
                            floatingLabelText="Password"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            value={this.state.loginData.password || ''}
                            onChange={this._handleCommonLoginChange.bind(this, 'password')}                                  
                        />
                    </Cell>
                    {/*<Cell col={12}>
                        <p style={{float: 'right', cursor: 'pointer'}} onClick={this._changeLoginUi.bind(this, 'newUser')}>New User</p>
                    </Cell>*/}
                </Grid>
            );
        }
    }

    // _handleUserTypeChange(event, index, value){
    //     this.setState({
    //         userTypeValue : value
    //     });
    // }

    _checkandSetLoginUi(){
        if(this.state.isLoggedin){
            return(
                <MenuItem primaryText="Log Out" onClick={this._setLogOut.bind(this)}/>
            );
        }else{
            return(
                <MenuItem primaryText="Log In" onClick={this._openLoginDialogue.bind(this)}/>
            );
        }
    }

    _handleLoginDialogSubmit(){
        if(this.state.isRegister){
            LoginAction._userLogin(this.state.loginData);
        }else{
            LoginAction._userRegistration(this.state.loginData);
        }
    }

    _setLogOut(){
        LoginAction._userLogOut();
        this.setState({
            openUserOption:false,
        });
    }

    _handleRequestClose(){
        this.setState({
            openSnackBar: false,
        });
    }

    render() {

        const LoginOptionAction = [
            <FlatButton style={styles.cancelButtonStyle} hoverColor="#237BFB" label="Cancel" primary={true} onTouchTap={this._handleLoginDialogCancel}/>,
            <FlatButton style={styles.saveButtonStyle}  label={this.state.isRegister? 'Log In' : 'Register'} primary={true} onTouchTap={this._handleLoginDialogSubmit} />,
            this.state.isRegister ? <p style={{marginTop: '5px', marginLeft: '10px' ,float: 'left', cursor: 'pointer'}} onClick={this._changeLoginUi.bind(this, 'newUser')}>New User</p> : <p style={{marginTop: '5px', marginLeft: '10px', float: 'left', cursor: 'pointer'}} onClick={this._changeLoginUi.bind(this, 'oldUser')}>Already have a Account</p>,
        ];

        return (
                <div className="demo-big-content">
                    <Layout fixedHeader>
                        <Header>
                            <HeaderRow title={<a href="#/" style={{textDecoration: 'none', color: '#ffffff'}}>WishList</a>}>
                                <TextField
                                    hintText="e.g-Sultan"
                                    floatingLabelText="Search"
                                    value={this.state.searchString}
                                    onChange={this._handleSearchChange.bind(this)} 
                                    autoFocus={true}                             
                                />
                                <Popover
                                    open={this.state.searchResultOpen}
                                    anchorEl={this.state.anchorSearchResult}
                                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                    onRequestClose={this._handleSearchResultClose.bind(this)}
                                    style = {{width: '500px'}}
                                    animation={PopoverAnimationVertical}
                                >
                                   <Menu desktop={true} onItemTouchTap={this._showMovieDetails.bind(this)} disableAutoFocus={true} >
                                        {this._showMoviesName()}
                                   </Menu>
                                </Popover>
                                
                                <SelectField
                                    style={styles.SearchFieldFontStyling}
                                    labelStyle={{padding: '0px'}} 
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    value={this.state.filterValue}
                                    onChange={this._handleFilterChange.bind(this)}
                                    floatingLabelText="Select Filter"
                                >                                    
                                    <MenuItem key={1} value="title" primaryText="Title" />
                                    <MenuItem key={2} value="actor" primaryText="Actor" />
                                    <MenuItem key={3} value="director" primaryText="Director" />
                                    <MenuItem key={4} value="producer" primaryText="Producer" />
                                    <MenuItem key={5} value="music director" primaryText="Music Director" />  
                                    <MenuItem key={6} value="production house" primaryText="Production House" />                                  
                                </SelectField>

                                <ul style={{listStyle: "none", marginTop: '20px', cursor: 'pointer', height: '48px', textAlign: 'center'}} onClick={this._openUserOption.bind(this)}>
                                    <li>
                                        <Avatar
                                            src={this.state.isLoggedin ? this.state.userType == "viewer" ? "user.png" : "theatre.jpg" : "login.png"}
                                        >
                                        </Avatar>
                                    </li>
                                    {Api._getKey("username") ? <li style={{fontSize: '10px'}}>{Api._getKey("username")}</li> : "Login"}
                                </ul>
                                <Popover
                                    open={this.state.openUserOption}
                                    anchorEl={this.state.anchorUserOption}
                                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                    style = {{width: '200px'}}
                                    onRequestClose={this._handleUserOptionClose.bind(this)}
                                    animation={PopoverAnimationVertical}
                                >
                                    <Menu desktop={true}>
                                        <MenuItem primaryText="Profile" />
                                        <MenuItem primaryText="Settings" />
                                        {this._checkandSetLoginUi()}
                                    </Menu>
                                </Popover>

                            </HeaderRow>
                           
                            <HeaderRow>                                
                                <Navigation>
                                    {this.state.isLoggedin? this.state.userType == 'viewer' ? <Link to="/mywishlist">My Wishlist</Link> : <Link to="/myshows">My Shows</Link> : null}
                                    {this.state.isLoggedin? this.state.userType == 'viewer' ? <Link to="#">My Bookings</Link>: null:null}
                                    <Link to="#">Trending movies</Link>             
                                    <Link to="/upcomingshows">Upcoming shows</Link>
                                    <Link to="#">Top Watched movies</Link>  
                                </Navigation>
                            </HeaderRow>
                        </Header>
                                   
                        <Content>
                            <Dialog
                                title={this.state.isRegister ? "Log In" : "Register"}
                                actions={LoginOptionAction}
                                modal={false}
                                open={this.state.openLoginDialogue}
                                autoScrollBodyContent = {true}
                                onRequestClose={this._handleLoginDialogCancel}
                                // bodyStyle={Style.AuthorizeTransaction.bodyStyle}
                                // actionsContainerStyle={Style.AuthorizeTransaction.actionStyle}
                                >
                                {/*<Divider/>*/}
                                    {this._setLoginDialogueUi()}
                            </Dialog>
                            <Snackbar
                                open={this.state.openSnackBar}
                                message={this.state.snackbarMsg}
                                autoHideDuration={4000}
                                onRequestClose={this._handleRequestClose}
                            />
                            {this.props.children}
                        </Content>
                    </Layout>
                </div>
        );
    }
};
