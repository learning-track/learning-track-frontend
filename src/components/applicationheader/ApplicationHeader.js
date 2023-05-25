import * as React from "react";

import {Link, useNavigate} from "react-router-dom";

import logo from '../lt.png';
import AuthClient from "../../services/AuthClient";
import './ApplicationHeader.css';

class ApplicationHeader extends React.Component {

    constructor() {
        super();
        let profile_button_text = (AuthClient.USERNAME && AuthClient.USERNAME !== "") ? AuthClient.USERNAME : "Профиль";
        if ((JSON.parse(localStorage.getItem('username')) || null) !== null) {
            profile_button_text = JSON.parse(localStorage.getItem('username'))
        }
        this.state = {
            profileButtonText: profile_button_text
        }
    }

    render() {
        return (<header className='header'>
            <nav className='header_nav'>
                <a>
                    {AuthClient.ACCESS_TOKEN !== null ? <Link to="/track"><img src={logo} alt="LT"/></Link> :
                        <Link to="/login"><img src={logo} alt="LT"/></Link>}
                </a>
                <ul>
                    <li>
                        <a href="#"><Link to="/track">Мой трек</Link></a>
                    </li>
                    <li>
                        <a href="#"><Link to="/courses">Курсы</Link></a>
                    </li>
                    <li>
                        <a href="#"><Link to="/articles">Статьи</Link></a>
                    </li>
                    <li>
                        <a href="#"><Link to="/jobs">Вакансии</Link></a>
                    </li>
                </ul>
                <div>
                    <a>
                        <i>

                        </i>
                        {AuthClient.ACCESS_TOKEN !== null ? <Link to="/profile">Профиль</Link> :
                            <Link to="/login">Войти</Link>}
                    </a>
                </div>
            </nav>
        </header>)
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
        // window.location.reload(false);
    }

    return (<button className="header_menu_button auth_header_button" onClick={handleSignOutButton}>
        Sign Out
    </button>);
}

export default ApplicationHeader;
