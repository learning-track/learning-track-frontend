import * as React from "react";
import {Navigate} from "react-router-dom";

import './Auth.css';

import AuthClient from "../../services/AuthClient";
import ApplicationHeader from "../applicationheader/ApplicationHeader";

class Auth extends React.Component {

    constructor() {
        super();
        this.state = {
            secondsLeft: 120, username: '', password: '', message: null, code: false, authorized: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitResult = this.handleSubmitResult.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(() => this.tick(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    tick() {
        if (this.state.code) {
            if (this.state.secondsLeft <= 0) {
                this.setState({
                    code: false,
                    secondsLeft: 120,
                    message: 'Время действия кода истекло. Попробуйте ещё раз.'
                })
            } else {
                this.setState({
                    secondsLeft: this.state.secondsLeft - 1
                })
            }
        }
    }

    handleSubmitResult(event) {
        console.log("Submit!")
        event.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(this.state.username)) {
            this.setState({
                message: 'Неверный формат'
            })
        } else if (!this.state.code) {
            this.setState({
                code: true
            })

            AuthClient.auth(this.state.username, this.state.password)
                .then((res => {
                    if (res.ok) {
                        AuthClient.USERNAME = this.state.username;
                        localStorage.setItem('username', JSON.stringify(this.state.username));
                    } else {
                        res.json().then(json => {
                            this.setState({
                                message: json.result, password: ''
                            });
                        }).catch(() => {
                            this.setState({
                                message: 'Ошибка авторизации!'
                            })
                        })
                    }
                }));
        } else {
            const inputs = Array.from(event.target.parentElement.getElementsByTagName('input'));

            let password = '';
            for (let i = 0; i < inputs.length - 1; i++) {
                console.log(inputs[i].value)
                password += inputs[i].value
            }
            console.log(password)

            AuthClient.auth(this.state.username, password)
                .then((res => {
                    if (res.ok) {
                        AuthClient.USERNAME = this.state.username;
                        localStorage.setItem('username', JSON.stringify(this.state.username));

                        AuthClient.ACCESS_TOKEN = res.headers.get("Authorization");
                        this.setState({
                            message: '', username: '', password: '', authorized: true
                        });
                        localStorage.setItem('sessionId', JSON.stringify(res.headers.get("Authorization")));
                    } else {
                        res.json().then(json => {
                            this.setState({
                                message: json.result, password: ''
                            });
                        }).catch(() => {
                            this.setState({
                                message: 'Ошибка авторизации!'
                            })
                        })
                    }
                }));
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value, message: ''
        });
    }

    validateInput(event) {
        const inputs = Array.from(event.target.parentElement.getElementsByTagName('input'));
        const index = inputs.indexOf(event.target);
        if (!/^\d*$/.test(event.target.value)) {
            event.target.value = '';
        }
        if (event.target.value >= 1 && index < 4) {
            inputs[index + 1].focus();
        }
    }

    fu(event) {
        const inputs = Array.from(event.target.parentElement.getElementsByTagName('input'));
        const index = inputs.indexOf(event.target);
        if (event.key === 'Backspace' && index > 0) {
            event.preventDefault();
            inputs[index - 1].focus();
            event.target.value = '';
        }
        if (event.key === 'Delete' && index < 4) {
            event.preventDefault();
            inputs[index + 1].focus();
            event.target.value = '';
        }
    }

    render() {
        if (this.state.authorized) {
            return (<Navigate to='/profile'/>);
        }

        return (<div>
            <ApplicationHeader/>
            {!this.state.code
                /*Email:*/ ? <div className="Auth">
                    <form onSubmit={this.handleSubmitResult} style={{alignItems: "center", justifyContent: "center"}}>
                        <div className="Auth">
                            <h1>Войдите или зарегистрируйтесь</h1>
                            <p>Чтобы начать пользоваться сервисом Learning Track</p>
                            <div className="email">
                                <input
                                    type="text"
                                    maxLength="320"
                                    placeholder="Электронная почта"
                                    value={this.state.username}
                                    name="username"
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div>{this.state.message}</div>
                            <div className="submitButtonHolder">
                                <input type="submit" className="auth_submit" value="Продолжить"/>
                            </div>
                        </div>
                    </form>
                </div>
                /*Code:*/ : <div className="Auth">
                    <form onSubmit={this.handleSubmitResult} style={{alignItems: "center", justifyContent: "center"}}>
                        <div className="Auth">
                            <h1>Введите код из письма</h1>
                            <p>
                                Мы отправили письмо на <b>{this.state.username}</b>
                            </p>
                            <div className="otp-box">
                                <input type="text" maxLength="1" placeholder="X" onInput={this.validateInput}
                                       onKeyDown={this.fu}/>
                                <input type="text" maxLength="1" placeholder="X" onInput={this.validateInput}
                                       onKeyDown={this.fu}/>
                                <input type="text" maxLength="1" placeholder="X" onInput={this.validateInput}
                                       onKeyDown={this.fu}/>
                                <input type="text" maxLength="1" placeholder="X" onInput={this.validateInput}
                                       onKeyDown={this.fu}/>
                                <input type="text" maxLength="1" placeholder="X" onInput={this.validateInput}
                                       onKeyDown={this.fu}/>
                            </div>
                            <div>{this.state.message}</div>
                            <p>
                                Время действия кода <span id="mySpan">{this.state.secondsLeft}</span> сек.
                            </p>
                            <div className="submitButtonHolder">
                                <input type="submit" className="auth_submit" value="Войти"/>
                            </div>
                        </div>
                    </form>
                </div>}
        </div>);
    }
}

export default Auth;
