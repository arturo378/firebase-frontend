import React, { Component } from 'react';
import './App.css';
import { isAuthenticated } from './config/api';
import Login from './Login'
import Home from './Home'
import { APP_TITLE } from './config/appInfo';


class App extends Component{
  constructor(props)
  {
    super(props);
    this.state={
      user : isAuthenticated() ? {} : null
    }
  }
  componentDidMount()
  {
    document.title = APP_TITLE;
  }

  render(){
    return (
      <div className="App">
        {this.state.user ? (<Home/>) : (<Login/>)}
      </div>
    );
  }
}

export default App;
