import * as React from "react";
import {Navigate, useNavigate} from "react-router-dom";

import './UserProfile.css';

import User from "../../dto/User";
import ApiClient from "../../services/ApiClient";
import AuthClient from "../../services/AuthClient";
import ApplicationHeader from "../applicationheader/ApplicationHeader";

class UserProfile extends React.Component {

    constructor() {
        super();

        this.state = {
            username: '', fullName: '', userCity: '', college: '', birthdayYear: '', desiredPosition: '',
        };

        ApiClient.getCurrentUser().then(res => {
            if (res.ok) {
                res.json().then(json => {
                    this.setState({
                        username: json.username,
                        fullName: json.fullName || '',
                        userCity: json.city || '',
                        college: json.college || '',
                        birthdayYear: json.birthdayYear || '',
                        desiredPosition: json.desiredPosition || '',

                        isProfileSyncedWithServer: false
                    })
                })
            } else {

            }
        });

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitResult = this.handleSubmitResult.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });

        if (this.state.isProfileSyncedWithServer) {
            this.setState({
                isProfileSyncedWithServer: false
            })
        }
    }

    handleSubmitResult(event) {
        event.preventDefault();

        let user = new User()
        user.fullName = this.state.fullName
        user.city = this.state.userCity
        user.college = this.state.college
        user.birthdayYear = this.state.birthdayYear
        user.desiredPosition = this.state.desiredPosition

        ApiClient.putCurrentUser(user)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        console.log(json)
                    })
                    this.setState({
                        isProfileSyncedWithServer: true
                    })
                } else {
                    console.log("Error")
                }
            });
    }

    render() {
        if (AuthClient.ACCESS_TOKEN == null) {
            return (<Navigate to='/login'/>)
        }

        return (<div>
            <ApplicationHeader/>
            <div className="UserProfile">
                <h3 type="profile_page_title">{this.state.username}</h3>

                <form onSubmit={this.handleSubmitResult}>
                    <label type="user_profile_fields_labels">ФИО</label>
                    <input type="user_profile_text"
                           value={this.state.fullName}
                           name="fullName"
                           onChange={this.handleChange}/>
                    <br/>
                    <label type="user_profile_fields_labels">Год рождения</label>
                    <input type="number"
                           value={this.state.birthdayYear}
                           name="birthdayYear"
                           onChange={this.handleChange}/>
                    <br/>
                    <label type="user_profile_fields_labels">Город</label>
                    <input type="user_profile_text"
                           value={this.state.userCity}
                           name="userCity"
                           onChange={this.handleChange}/>
                    <br/>
                    <label type="user_profile_fields_labels">Учебное заведение</label>
                    <input type="user_profile_text"
                           value={this.state.college}
                           name="college"
                           onChange={this.handleChange}/>
                    <br/>
                    <label type="user_profile_fields_labels">Желаемая должность</label>
                    <input type="user_profile_text"
                           value={this.state.desiredPosition}
                           name="desiredPosition"
                           onChange={this.handleChange}/>
                    <br/>
                    <input type="submit"
                           className="user_profile_update_submit"
                           value={this.state.isProfileSyncedWithServer ? "Данные успешно обновлены!" : "Обновить данные"}
                           disabled={this.state.isProfileSyncedWithServer}
                    />
                </form>
                <SignOutButton/>
            </div>
        </div>)
    }
}

function SignOutButton() {

    let navigate = useNavigate()

    function handleSignOutButton() {
        AuthClient.ACCESS_TOKEN = null;
        AuthClient.USERNAME = null;

        localStorage.setItem('sessionId', null);
        localStorage.setItem('username', null);

        navigate('/login');
    }

    return (<button className="user_profile_sign_out" onClick={handleSignOutButton}>Выйти</button>);
}

export default UserProfile;
