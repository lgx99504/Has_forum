import React, { Component } from "react";
import axios from "axios";
import { Host } from './app';
import { Link } from 'react-router-dom';

export default class SearchPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            search: "",
            data: []
        }

    }

    componentDidMount(){
        this.props.that.setState({
            isShowSearch: false
        })
        this.doFetchData(this.props.match.params.title)
    }

    doFetchData(param){
        axios.get(`${Host}/search/${param}`).then((res)=>{
            if(res.data.status == "ok"){
                console.log("success")
                this.setState({
                    data: res.data.data
                })
            }
        })
    }
    
    render() {
        return (
            <div>
            <div className="container" id="bread-nav">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Library</li>
                    </ol>
                </nav>
            </div>
            <div className="container">
                <ul className="list-group list-group-flush">
                    {this.state.data.map((v,k) => {
						return (
                            <li className="list-group-item" key={k}>
                                <div className="row">
                                    <div className="col-md-11">
                                        <Link to={"/reply/" + v._id}>{v.title}</Link><br/>
                                        <span>{v.user_id}发表于{v.created_at}。</span>
                                    </div>
                                    <div className="col-md-1">
                                        <div className="container">
                                            <p>{v.count}</p>
                                        </div>
                                        <p>Replies</p>
                                    </div>
                                </div>
                            </li>
						)
					})}
                </ul>
            </div>
        </div>
        )
    }
}