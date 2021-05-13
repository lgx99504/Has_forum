import React, { Component } from 'react';
import { HashRouter, Route, Switch,Link } from 'react-router-dom';
import LogInPage from './logInPage';
import SignInPage from './signInPage';
import HomePage from './homepage';
import TopicPage from './topicpage';
import ReplyPage from './replypage';
import CreateCategory from './createcategory';
import CreateTopic from './createtopic';
import SearchPage from "./searchPage";
import axios from "axios";
import { Host } from './app';
import { createHashHistory } from 'history';

class BasicRoute extends Component {
    constructor(props){
        super(props)

        this.state = {
            user: {},
            search: "",
            isShowSearch: true,
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        }

        this.handleLogOut = this.handleLogOut.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
        this.handleOldPasswordChange = this.handleOldPasswordChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    }

    componentDidMount(){
        const user = localStorage.getItem("user");
        if (user){
            this.setState({
                user: JSON.parse(user)
            })
        }
        console.log(this.state.user)
    }

    handleNewPasswordChange(e) {
        this.setState({
            newPassword: e.target.value,
        })
    }

    handleOldPasswordChange(e) {
        this.setState({
            oldPassword: e.target.value,
        })
    }

    handleConfirmPasswordChange(e) {
        this.setState({
            confirmPassword: e.target.value,
        })
    }

    handlePasswordSubmit() {
        axios.post(`${Host}/users/change_password`, {
            password: this.state.newPassword,
            confirm_password: this.state.confirmPassword,
            old_password: this.state.oldPassword,
            user_id: this.state.user._id            
        })
        .then(({data}) => {
            if (data.status == "ok") {
                localStorage.removeItem("user");
                window.location.href = "/";
                alert("修改成功！")
            } else {
                alert(data.error);
            }
        })
    }

    handleLogOut() {
        axios.post(`${Host}/logout`, {})
        .then(({data}) => {
            if (data.status == "ok") {
                localStorage.removeItem("user");
                window.location.reload();
            } else {
                alert(data.error);
            }
        })
    }

    setAdmin(){
        axios.post(`${Host}/set_admin`, {
            id: this.state.user._id
        })
        .then(({data}) => {
            if (data.status == "ok") {
                localStorage.setItem("user", JSON.stringify(data.data.user))
                window.location.reload()
            } else {
                alert(data.error);
            }
        }) 
    }
    
    onSearch(){
        const history = createHashHistory();
        history.push("/login")
    //  debugger
    //  this.props.history.push("/login")
    }

    render(){
        return(
            <HashRouter>
                <div className="container" id="head-nav">
                    <div className="forum-icon" style={{float: 'left'}}>
                        <i className="fa fa-ra fa-3x"></i>
                        <h1>Has-Forum</h1>
                    </div>
                    <div>
                        <ul className="nav justify-content-end">
                            <li className="nav-item">
                                <Link className="nav-link" to="/" style={{color: "black"}}>Home</Link>
                            </li>
                            {this.state.user.email  ? 
                            <>
                            <button type="button" className="btn btn-primary user-info" data-toggle="modal" data-target="#exampleModal">
                            Change Pwd
                            </button>
                            <button type="button"  className="btn btn-primary user-info" onClick={this.setAdmin.bind(this)}>
                            Set Admin
                            </button>
                            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Change Password</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Old Password</label>
                                            <input onChange={this.handleOldPasswordChange} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword1">New Password</label>
                                            <input onChange={this.handleNewPasswordChange} className="form-control" id="exampleInputPassword1" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword1">Confirm Password</label>
                                            <input onChange={this.handleConfirmPasswordChange} className="form-control" id="exampleInputPassword1" />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button onClick={this.handlePasswordSubmit} type="button" className="btn btn-primary">Save changes</button>
                                </div>
                                </div>
                            </div>
                            </div>
                            <button onClick={this.handleLogOut} className="user-info">Log Out</button>
                            </>
                            :
                            <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login" style={{color: "black"}}>Log In</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/signin" style={{color: "black"}}>Sign In</Link>
                            </li>
                            </>
}
                        </ul>
                    </div>
                </div>
                {this.state.isShowSearch ?  
                    <div id="search-card">
                    <div className="container">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <button className="btn btn-outline-secondary"
                                type="button" id="search-btn">
                                    <Link to={{pathname: "/search/" + this.state.search}}><i className="fa fa-search fa-lg"></i></Link>
                                </button>
                            </div>
                        <input type="text" className="form-control" id="search-input" onChange={(e)=>{
                            this.setState({
                                search: e.target.value
                            })
                        }} placeholder="Search" />
                        </div>
                    </div>
                </div>
                : null
                }
        <Switch>
            <Route exact path="/" render={(props)=>
                <HomePage {...props} user={this.state.user} that={this}/>} />
            <Route exact path="/signin" render={(props) => <SignInPage {...props} that={this}/>}/>
            <Route exact path="/login" render={(props)=> <LogInPage {...props} that={this}/>}/>
            <Route exact path="/topic/:id" render={(props) => <TopicPage {...props} that={this} user={this.state.user} />} />
            <Route exact path="/reply/:id" render={(props)=> <ReplyPage {...props} user={this.state.user} that={this} />}/>
            <Route exact path="/createcategory" component={CreateCategory}/>
            <Route exact path="/search/:title" render={(props) => <SearchPage {...props} that={this}/>}/>
            <Route exact path="/createtopic/:id" render={(props)=> <CreateTopic {...props} user={this.state.user} />}/>
        </Switch>
    </HashRouter>
        )
    }
}

export default BasicRoute;