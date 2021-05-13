import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/forum.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { Host } from './app';
import axios from "axios";

export default class CreateCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            description: "",
            icon: "",
            icon_backgroundColor: "",
        }

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleIconChange = this.handleIconChange.bind(this);
        this.handleBackgroundcolorChange = this.handleBackgroundcolorChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTitleChange(e) {
        this.setState({
            title: e.target.value
        })
    }

    handleDescriptionChange(e) {
        this.setState({
            description: e.target.value
        })
    }

    handleIconChange(e) {
        this.setState({
            icon: e.target.value
        })
    }

    handleBackgroundcolorChange(e) {
        this.setState({
            icon_backgroundColor: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        axios.post(`${Host}/categories`, {
            title: this.state.title,
            description: this.state.description,
            icon: this.state.icon,
            icon_backgroundColor: this.state.icon_backgroundColor,
        })
        .then(({data}) => {
            if (data.status == "ok") {
                alert("创建成功!");
                this.props.history.push("/");
            } else {
                alert(data.error);
            }
        })
    }

    render() {

        const { title,description,icon,icon_backgroundColor } = this.state;

        return (
            <div>
                <div className="container">
                    <div className="container">
                        <h5 className="categories_title">Categories</h5>
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">Title</span>
                        </div>
                        <input placeholder="title..." onChange={this.handleTitleChange} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">Description</span>
                        </div>
                        <input placeholder="description..." onChange={this.handleDescriptionChange} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">Icon</span>
                        </div>
                        <input placeholder="camera/home/car/cog/cloud..." onChange={this.handleIconChange} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">Icon-BackgroundColor</span>
                        </div>
                        <input placeholder="yellow/black/green/pink/blue..." onChange={this.handleBackgroundcolorChange} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                    </div>
                    <button onClick={this.handleSubmit} className="create-category">提交</button>
                </div>
            </div>
        )
    }
}