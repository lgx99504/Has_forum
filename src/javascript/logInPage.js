import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import '../styles/forum.scss';
import axios from "axios";
import { Host } from './app';

export default class LogInPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: "",
            password: "",
            unaccountHelp: "",
            unpasswordHelp: ""
        }

        this.handleChangeAccount = this.handleChangeAccount.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.props.that.setState({
            isShowSearch: false
        })
    }

    handleChangeAccount(e) {
        this.setState({ account: e.target.value}, () => {
            if (this.state.account === "" || this.state.account === null) {
                this.setState({
                    unaccountHelp: "*The account cannot be empty!"
                })
            } else {
                this.setState({
                    unaccountHelp: ""
                })
            }
        })
    }

    handleChangePassword(e) {
        this.setState({ password: e.target.value}, () => {
            if (this.state.password === "" || this.state.password === null) {
                this.setState({
                    unpasswordHelp: "*The password cannot be empty!"
                })
            } else {
                this.setState({
                    unpasswordHelp: ""
                })
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        if ((this.state.account === "" || this.state.account === null) || (this.state.password === "" || this.state.password === null)) {
            
        } else {
            axios.post(`${Host}/sessions`, {
                email: this.state.account,
                password: this.state.password,
            })
            .then(({data}) => {
                if (data.status == "ok") {
                    alert("登录成功!");
                    localStorage.setItem("user", JSON.stringify(data.data.user))
                    this.props.history.push("/");
                    window.location.reload();
                } else {
                    alert(data.error);
                }
            })
        }
    }

    render() {
        const { account, password ,unaccountHelp , unpasswordHelp} = this.state;

        return (
            <div className="container">
                <div className="login-card">
                    <div className="container"><h1 className="welcome-title">Welcome to</h1></div>
                    <div className="container"><h1 className="welcome-title">Home Automation System Form.</h1></div>
                    <div className="log-in">
                        <form>
                            <div className="form-group">
                                <label className="login-label" forhtml="Account">Account</label>
                                <br />
                                <input
                                type="text"
                                className="form-control"
                                id="account-input"
                                placeholder="*Cellphone/Email"
                                aria-describedby="emailHelp"
                                onChange={this.handleChangeAccount}
                                />
                            </div>
                            <span className="warn-info">{this.state.unaccountHelp}</span>
                            <div className="form-group">
                                <label className="login-label" forhtml="password">Password</label>
                                <br />
                                <input
                                type="password"
                                className="form-control"
                                id="password-input"
                                placeholder="*password"
                                onChange={this.handleChangePassword}
                                />
                            </div>
                            <span className="warn-info">{this.state.unpasswordHelp}</span>
                            <br />
                            <button
                            type="submit"
                            className="btn btn-primary"
                            id="submit"
                            onClick={this.handleSubmit}>
                                Log In
                            </button>
                            <button
                            className="btn btn-primary"
                            id="submit"
                            onClick={() => this.props.history.push('signin')}
                            >Sign In</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}