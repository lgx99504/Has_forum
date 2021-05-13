import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/forum.scss';
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import { Host } from './app';

export default class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.props.that.setState({
            isShowSearch: true
        })
        axios.get(`${Host}/categories`)
        .then(({data}) => {
            if (data.status == "ok") {
                this.setState({data: data.data.categories});
            } else {
                alert(data.error);
            }
        })
    }

    delete(e){
        axios.post(`${Host}/cate/${e}`)
        .then(({data}) => {
            if (data.status == "ok") {
                window.location.reload()
            } else {
                alert(data.error);
            }
        })
    }

    render() {
        return (
            <div>
                <div className="container">
                    <h5 className="categories_title">Categories</h5>
                </div>
                <div className="container">
                {this.props.user.is_admin &&
                    <button className="create-category">
                        <Link to="/createcategory" style={{color: 'white'}}>新建板块</Link>
                    </button>
                }
                </div>
                <div className="container category-list">
                    <ul className="list-group">
                        {this.state.data.map((v, k) => {
                            return (
                                <li className="list-group-item" key={k}>
                                    <div className="row">
                                        <div className="category-icon col-md-1">
                                            <div style={{backgroundColor: v.icon_backgroundColor}}>
                                                <i className={"fa fa-" + v.icon + " fa-2x"} />
                                            </div>
                                        </div>
                                        <div className="col-md-10">
                                            <h4><Link id="title-link" to={{
                                                pathname: "/topic/" + v._id
                                            }}>{v.title}</Link></h4>
                                            <p style={{float: 'left'}}>{v.description}</p>
                                            {this.props.user.is_admin && <a href="" onClick={this.delete.bind(this, v._id)}>删除</a>}
                                        </div>
                                        <div className="col-md-1">
                                            <div className="container"><p id="topic-count">{v.count}</p></div>
                                            <p>Topics</p>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="rooter">
                    <p className="rooter-info">$ Design by Liu_gx.Email-1171181057@qq.com $</p>
                </div>
            </div>
            
        )
    }
}