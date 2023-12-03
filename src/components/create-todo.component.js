import React, { Component } from "react";
import axios from "axios";
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";

export default class CreateTodo extends Component {
    constructor(props) {
        super(props);
        this.onChangeActivity = this.onChangeActivity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            activity: "",
        };
    }
    onChangeActivity(e) {
        this.setState({
            activity: e.target.value,
        });
    }
    onSubmit(e) {
        e.preventDefault();
        const activityvar = {
            activity: this.state.activity,
        };
        console.log(activityvar);
        axios.post("https://tracker-fe-practice.onrender.com/todos/add", activityvar)
            .then((res) => {
            window.location = "/";
        });
    }

    render() {
        return (
            <div>
                <h3>Create New Task</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> <label>New Task: </label> <input
                        type="text"
                        required className="form-control" value={this.state.activity} onChange={this.onChangeActivity}
                    /> </div>
                    <div className="form-group"> <input
                        type="submit" value="Create Activity Log" className="btn btn-primary"
                    /> </div>
                </form>
            </div>);
    }
}