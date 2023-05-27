import * as React from "react";
import {useNavigate} from "react-router-dom";

import '@fortawesome/fontawesome-free/css/all.css';

import './ApplicationHeader.css';

import AuthClient from "../../services/AuthClient";

class ApplicationHeader extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <header>
                <Logo/>
                <NavigationBar/>
                <NavigationMenu/>
            </header>
        )
    }
}

function Logo() {

    let navigate = useNavigate()

    function handleClickLogo() {
        AuthClient.ACCESS_TOKEN !== null ? navigate('/track') : navigate('/login');
    }

    return (
        <div className="logo" onClick={handleClickLogo}>
            <span className="fab fa-l"></span>
            <span className="fab fa-t"></span>
            <h1>Learning Track</h1>
        </div>
    );
}

function NavigationBar() {

    let navigate = useNavigate()

    return (
        <div className="navbar" id="nav">
            <div className="searchBox">
                <input type="text" placeholder="Поиск по курсам . . ."/>
                <span className="fas fa-search" id="searchIcon"></span>
            </div>
            <ul>
                <li onClick={() => {AuthClient.ACCESS_TOKEN !== null ? navigate('/track') : navigate('/login');}}>
                    <span className="fa-solid fa-road" id="headIcon"></span>
                    <a href="#">Мой трек</a>
                </li>
                <li onClick={() => {navigate('/courses')}}>
                    <span className="fa-solid fa-graduation-cap" id="headIcon"></span>
                    <a href="#">Курсы</a>
                </li>
                <li onClick={() => {navigate('/articles')}}>
                    <span className="fa-solid fa-newspaper" id="headIcon"></span>
                    <a href="#">Статьи</a>
                </li>
                <li onClick={() => {navigate('/vacancies')}}>
                    <span className="fa-solid fa-briefcase" id="headIcon"></span>
                    <a href="#">Вакансии</a>
                </li>
                {AuthClient.ACCESS_TOKEN !== null ?
                    <li onClick={() => {navigate('/profile')}}>
                        <span className="fa fa-user-circle" id="headIcon"></span>
                        <a href="#">Профиль</a>
                    </li> :
                    <li onClick={() => {navigate('/login')}}>
                        <span className="fas fa-sign-in" id="headIcon"></span>
                        <a href="#">Войти</a>
                    </li>
                }
            </ul>
        </div>
    );
}

function NavigationMenu() {
    return (
        <span className="fas fa-bars" id="menuIcon" onClick={() => {
            document.getElementById("nav").classList.toggle("nav-active");
            document.body.classList.toggle("scroll-lock");
        }}></span>);
}

export default ApplicationHeader;
