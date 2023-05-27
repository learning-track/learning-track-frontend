import * as React from "react";
import {Navigate, useNavigate} from "react-router-dom";

import './Profile.css';

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

        // const signUpButton = document.getElementById('signUp');
        // const signInButton = document.getElementById('signIn');
        // const container = document.getElementById('container');
        //
        // signUpButton.addEventListener('click', () => {
        //     container.classList.add("right-panel-active");
        // });
        //
        // signInButton.addEventListener('click', () => {
        //     container.classList.remove("right-panel-active");
        // });

        if (AuthClient.ACCESS_TOKEN == null) {
            return (<Navigate to='/login'/>)
        }

        return (<div>
            <ApplicationHeader/>
            <div className="UserProfile">
                <div className="container" id="container">
                    <div className="form-container sign-up-container">
                        <form action="#">
                            <h1>Create Account</h1>
                            <span>Редактировать данные профиля</span>
                            <input type="text" placeholder="Name"/>
                            <input type="email" placeholder="Email"/>
                            <input type="password" placeholder="Password"/>
                            <button>Sign Up</button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form action="#" onSubmit={this.handleSubmitResult}>
                            <h4>Профиль</h4>
                            <h6>{this.state.username}</h6>
                            <label type="user_profile_fields_labels">
                                {this.state.fullName === '' ? "ФИО (пока не заполнена)" : "ФИО"}
                            </label>
                            <input type="user_profile_text"
                                   placeholder="ФИО"
                                   value={this.state.fullName}
                                   name="fullName"
                                   onChange={this.handleChange}/>
                            <label type="user_profile_fields_labels">
                                {this.state.birthdayYear === '' ? "Год рождения (пока не заполнен)" : "Год рождения"}
                            </label>
                            <input type="user_profile_text"
                                   placeholder="Год рождения"
                                   value={this.state.birthdayYear}
                                   name="birthdayYear"
                                   onChange={this.handleChange}/>
                            <label type="user_profile_fields_labels">
                                {this.state.userCity === '' ? "Город (пока не заполнена)" : "Город"}
                            </label>
                            <input type="user_profile_text"
                                   placeholder="Город"
                                   value={this.state.userCity}
                                   name="userCity"
                                   onChange={this.handleChange}/>
                            <label type="user_profile_fields_labels">
                                {this.state.college === '' ? "Учебное заведение (пока не заполнено)" : "Учебное заведение"}
                            </label>
                            <input type="user_profile_text"
                                   placeholder="Учебное заведение"
                                   value={this.state.college}
                                   name="college"
                                   onChange={this.handleChange}/>
                            <label type="user_profile_fields_labels">
                                {this.state.desiredPosition === '' ? "Желаемая должность (пока не заполнена)" : "Желаемая должность"}
                            </label>
                            <input type="user_profile_text"
                                   placeholder="Желаемая должность"
                                   value={this.state.desiredPosition}
                                   name="desiredPosition"
                                   onChange={this.handleChange}/>
                            <input type="submit"
                                   className="user_profile_update_submit"
                                   value={this.state.isProfileSyncedWithServer ? "Данные успешно обновлены!" : "Обновить данные профиля"}
                                   disabled={this.state.isProfileSyncedWithServer}
                            />
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1>Welcome Back!</h1>
                                <p>To keep connected with us please login with your personal info</p>
                                <button className="ghost" id="signIn">Sign In</button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h6>Мои навыки</h6>
                                <p>Здесь Вы можете редактировать свои навыки</p>
                                <button className="ghost" id="signUp">Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default UserProfile;
