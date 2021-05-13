import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/forum.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { Host } from './app';
import axios from "axios";

export default class CreateTopic extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            content: "",
        }

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount(){
        console.log("user", this.props.user)
        console.log("cate id", this.props.match.params.id)
    }

    handleTitleChange(e) {
        this.setState({
            title: e.target.value
        })
    }

    handleContentChange(e) {
        this.setState({
            content: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        axios.post(`${Host}/topics/${this.props.match.params.id}`, {
            title: this.state.title,
            content: this.state.content,
            user_id: this.props.user._id,
        })
        .then(({data}) => {
            if (data.status == "ok") {
                alert("发帖成功!");
                this.props.history.goBack();
            } else {
                alert(data.error);
            }
        })
    }

    render() {

        const { title,content,category_id,user_id } = this.state;

        return (
            <div>
                <div className="container">
                    <div className="container">
                        <h5 className="categories_title">Topics</h5>
                    </div>
                    <div className="container">
                        <form>
                            <div className="form-group">
                                <label htmlFor="exampleFormControlInput1">Title</label>
                                <input onChange={this.handleTitleChange} class="form-control" id="exampleFormControlInput1" placeholder="Your title topic..." />
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Content</label>
                                <textarea onChange={this.handleContentChange} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <button onClick={this.handleSubmit} className="create-category">Submit</button>
                </div>
            </div>
        )
    }
}