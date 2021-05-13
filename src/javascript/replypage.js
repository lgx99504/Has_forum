import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/forum.scss';
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import { Host } from './app';

export default class ReplyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            topic: null,
            replies: [],
            content: "",
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.props.that.setState({
            isShowSearch: false
        })
        console.log("user",this.props.user);
        console.log("topic id", this.props.match.params.id)

        var id = this.props.match.params.id;
          axios.get(`${Host}/topics/${id}`)
          .then(({data}) => {
              if (data.status == "ok") {
                  this.setState({
                      topic: data.data.topic,
                      replies: data.data.replies,
                  })
              } else {
                  alert(data.error);
              }
          })
      }

      handleInputChange(e) {
        this.setState({
            content: e.target.value
        })
      }

      handleSubmit(e) {
        e.preventDefault();
        axios.post(`${Host}/replies/${this.props.match.params.id}`, {
            content: this.state.content,
            user_id: this.props.user._id,
            topic_id: this.props.match.params.id,
        })
        .then(({data}) => {
            if (data.status == "ok") {
                alert("回复成功!");
                window.location.reload();
            } else {
                alert(data.error);
            }
        })
    }

    render() {
        const { content } = this.state;

        return (
            <div>
                {this.state.topic &&
                <div className="container topic-card"> 
                    <div id="topic-title"><h1>{this.state.topic.title}</h1></div>
                    <div id="topic-create-at"><span>{this.state.topic.user_name}发表于{this.state.topic.created_at}.</span></div>
                    <div id="topic-content"><p>{this.state.topic.content}</p></div>
                </div>}
                <div className="container">
                    <h1 className="reply-card-title">Replies :</h1>
                </div>
                <div className="container">
                    <ul className="list-group">
                        {this.state.replies.map((v,k) => {
                            return (
                                <li className="list-group-item" key={k}>
                                    <div><h5>{v.user_name}</h5><span>{v.created_at}</span></div>
                                    <div><p>{v.content}</p></div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                {this.props.user.email && 
                <div className="container  write-reply-card">
                    <div class="form-group">
                        <label htmlFor="exampleFormControlTextarea1">Your Reply：</label>
                        <textarea onChange={this.handleInputChange} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    <button onClick={this.handleSubmit} id="submit-reply">发表</button>
                </div>
                }
                <div className="rooter">
                    <p className="rooter-info">$ Design by Liu_gx.Email-1171181057@qq.com $</p>
                </div>
            </div>
        )
    }
}