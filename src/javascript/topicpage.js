import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/forum.scss';
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import { Host } from './app';

export default class TopicPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            id: props.match.params.id
        }
    }
    
    componentDidMount(){
        this.props.that.setState({
            isShowSearch: false
        })
      var id = this.props.match.params.id;
        axios.get(`${Host}/categories/${id}`)
        .then(({data}) => {
            if (data.status == "ok") {
                this.setState({
                    data: data.data.topics
                })
            } else {
                alert(data.error);
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
                {this.props.user.email &&
                    <button className="create-category"><Link to={"/createtopic/" + this.state.id} style={{color: 'white'}}>发表帖子</Link></button>
                }
                <ul className="list-group list-group-flush">
                    {this.state.data.map((v,k) => {
						return (
                            <li className="list-group-item" key={k}>
                                <div className="row">
                                    <div className="col-md-11">
                                        <Link to={"/reply/" + v._id}>{v.title}</Link><br/>
                                        <span>{v.user_name}发表于{v.created_at}。</span>
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