import React from 'react';
import {Link} from 'react-router';

import Avatar from 'material-ui/Avatar';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import {Grid, Cell, Layout, Header, HeaderRow, Navigation, Drawer, Content, Icon, Textfield} from 'react-mdl';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Menu from 'material-ui/Menu';

import * as MovieSearchAction from '../actions/moviesearchaction';
import MoviesListStore from '../stores/moviesliststore';

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

};


export default class HomePage extends React.Component {
    constructor(){
        super();
        this.state = {
            filterValue : 'actor',
            searchString: '',
            searchResultOpen: false,
            movieList: [],
        };
    }

    componentWillMount(){
        MoviesListStore.on('change',this._getMovieList.bind(this)); 
    }

    componentWillUnmount(){
        MoviesListStore.removeListener('change', this._getMovieList.bind(this));
    }

    _getMovieList(type){
        if(type == "MOVIES"){
            let movieList = MoviesListStore._getMovieList();
            this.setState({movieList : movieList});
            //console.log(movieList);
        }
    }

    _handleSearchChange(event, value){
        console.log('value', value);
        this.setState({searchString: value, anchorEl: event.target, searchResultOpen: true});
        let query = {};
        //console.log(event.target.value);
        query[this.state.filterValue] = event.target.value;
        MovieSearchAction._searchMovie(query);
    }

    _handleFilterChange(event, index, value){
        this.setState({filterValue : value});
    }

    _handleSearchResultClose(){
        this.setState({searchResultOpen : false});
    }

    _showMoviesName(){
        let temp = this.state.movieList;
            return(
                temp.map(function(result, index){
                    return(
                       <MenuItem key={index} value={result.uid} primaryText={result.title} style = {{'fontSize': '11px'}} containerElement={<Link to={`/moviedetails/${result.uid}`}/>}></MenuItem>
                )
            })
        );
    }

    _showMovieDetails(event, menuItem, index){
        console.log('id' , menuItem.props.value, index);
    }

    render() {
        return (
                <div className="demo-big-content">
                    <Layout fixedHeader>
                        <Header>
                            <HeaderRow title={<a href="#/" style={{textDecoration: 'none', color: '#ffffff'}}>WishList</a>}>
                                <TextField
                                    hintText="e.g-Sultan"
                                    floatingLabelText="Search"
                                    autoFocus={true}
                                    value={this.state.searchString}
                                    onChange={this._handleSearchChange.bind(this)}                                  
                                />
                                <Popover
                                      open={this.state.searchResultOpen}
                                      anchorEl={this.state.anchorEl}
                                      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                      targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                      onRequestClose={this._handleSearchResultClose.bind(this)}
                                      style = {{width: '500px'}}
                                      animation={PopoverAnimationVertical}
                                >
                                   <Menu desktop={true} onItemTouchTap={this._showMovieDetails.bind(this)}>
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
                                    <MenuItem key={5} value="music house" primaryText="Music House" />  
                                    <MenuItem key={6} value="production house" primaryText="Production House" />                                  
                                </SelectField>
                                <Avatar>A</Avatar>
                            </HeaderRow>
                            <HeaderRow>
                                <Navigation>
                                    <Link to="/mywishlist">My Wishlist</Link>
                                    <Link to="#">My Booking</Link>
                                    <Link to="#">Trending movie</Link>             
                                    <Link to="#">Upcoming shows</Link>
                                    <Link to="#">Top Watched movies</Link>  
                                </Navigation>
                            </HeaderRow>
                        </Header>
                        <Drawer title="Panel Items"> 
                            <Navigation>
                                <Link to="#">My Wishlist</Link>
                                <Link to="#">My Booking</Link>
                                <Link to="#">Trending movie</Link>             
                                <Link to="#">Upcoming shows</Link>
                                <Link to="#">Top Watched movies</Link>                             
                            </Navigation>
                        </Drawer>
                        <Content>
                            {this.props.children}
                        </Content>
                    </Layout>                
                </div>
        );
    }
};
