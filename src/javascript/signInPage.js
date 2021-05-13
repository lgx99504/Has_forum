import React, { Component } from 'react';
import '../styles/forum.scss';
import axios from "axios";
import { Host } from './app';

export default class SignInPage extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            account: "",
            password: "",
            repeatPassword: "",
            wrongAccountHelp: "",
            wrongPasswordHelp: "",
            diffPasswordHelp: ""
        }

        this.handleChangeAccount = this.handleChangeAccount.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeRepeatPassword = this.handleChangeRepeatPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.props.that.setState({
            isShowSearch: false
        })
    }

    handleChangeAccount(e) {
        // const accountReg01 = /^[1][3,5,7,8][0-9]{9}$/;
        // const accountReg02 = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

        this.setState({ account: e.target.value}, () => {
            if (this.state.account === "" || this.state.account === null) {
                this.setState({
                    wrongAccountHelp: "*The account cannot be empty!"
                })
            } 
            // else if ((accountReg01.test(this.state.account) != true) && (accountReg02.test(this.state.account) != true)) {
            //     this.setState({
            //         wrongAccountHelp: "*Incorrect format of phone number or email！"
            //     })
            // }
            else {
                this.setState({
                    wrongAccountHelp: ""
                })
            }
        })
    }

    handleChangePassword(e) {
        const passwordReg = /^[a-zA-Z]\w{5,17}$/;

        this.setState({ password: e.target.value}, () => {
            if (this.state.password === "" || this.state.password === null) {
                this.setState({
                    wrongPasswordHelp: "*The password cannot be empty!"
                })
            } else if (passwordReg.test(this.state.password) != true) {
                this.setState({
                    wrongPasswordHelp: "*The password format is incorrect!"
                })
            } else {
                this.setState({
                    wrongPasswordHelp: ""
                })
            }
        })
    }

    handleChangeRepeatPassword(e) {
        this.setState({ repeatPassword: e.target.value}, () => {
            if (e.target.value === this.state.password) {
                this.setState({
                    diffPasswordHelp: ""
                })
            } else {
                this.setState({
                    diffPasswordHelp: "*Password Inconsistency!"
                })
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        if ((this.state.account === "" || this.state.account === null)
            || (this.state.password === "" || this.state.password === null)
            || (this.state.repeatPassword === "" || this.state.repeatPassword === null)) {
            alert("Account , password or repeatPassword should not be blank.")
        } else {
            axios.post(`${Host}/users`, {
                email: this.state.account,
                password: this.state.password,
                confirm_password: this.state.repeatPassword,
            })
            .then(({data}) => {
                if (data.status == "ok") {
                    alert("注册成功!");
                    this.props.history.push("/login");
                } else {
                    alert(data.error);
                }
            })
        }
    }

    render() {
        const { account, password ,wrongPasswordHelp , wrongAccountHelp, repeatPassword } = this.state;

        return (
            <div>
                <div className="login-card">
                    <div className="container"><h1 className="welcome-title">Use your phone number</h1></div>
                    <div className="container"><h1 className="welcome-title">Or email to register your account.</h1></div>
                    <div className="log-in">
                        <form>
                            <div className="form-group">
                                <label className="login-label" forhtml="Account">Account</label>
                                <br />
                                <input
                                className="form-control"
                                id="account-input"
                                placeholder="Cellphone/Email"
                                onChange={this.handleChangeAccount}
                                />
                                <span className="tips">*Only phone number or email.</span>
                            </div>
                            <span className="warn-info">{this.state.wrongAccountHelp}</span>
                            <div className="form-group">
                                <label className="login-label" forhtml="password">Password</label>
                                <br />
                                <input
                                type="password"
                                className="form-control"
                                id="password-input"
                                placeholder="Password"
                                onChange={this.handleChangePassword}
                                />
                                <span className="tips">*Only letter at the beginning and [a-Z]+[0-9](8-16). </span>
                            </div>
                            <span className="warn-info">{this.state.wrongPasswordHelp}</span>
                            <div className="form-group">
                                <label className="login-label" forhtml="password">RepeatPassword</label>
                                <br />
                                <input
                                type="password"
                                className="form-control"
                                id="password-input"
                                placeholder="RepeatPassword"
                                onChange={this.handleChangeRepeatPassword}
                                />
                                <span className="tips">*Make sure it's the same password as above. </span>
                            </div>
                            <span className="warn-info">{this.state.diffPasswordHelp}</span>
                            <br />
                            <button
                            type="submit"
                            className="btn btn-primary"
                            id="submit"
                            onClick={this.handleSubmit}>
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}