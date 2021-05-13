import React, {Component} from 'react';
import ReactDom from 'react-dom';
import LogInPage from './logInPage';
import SignInPage from './signInPage';
import Router from './Router';
import HomePage from './homepage';
import TopicPage from './topicpage';
import "bootstrap";
import '../styles/forum.scss';
import { HashRouter, Route, Switch,Link } from 'react-router-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Router {...this.props} />
            </div>
        )
    }
}

ReactDom.render((
    <App />
    
),document.getElementById('app')
)