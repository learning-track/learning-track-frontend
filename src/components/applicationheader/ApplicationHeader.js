import * as React from "react";
import {Link} from "react-router-dom";

import './ApplicationHeader.css';

import AuthClient from "../../services/AuthClient";

class ApplicationHeader extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (<header className='header'>
            <nav>
                <a>
                    {AuthClient.ACCESS_TOKEN !== null ?
                        <Link to="/track"><img src="https://i.ibb.co/NxTnBmX/lt.png" alt="LT"/></Link> :
                        <Link to="/login"><img src="https://i.ibb.co/NxTnBmX/lt.png" alt="LT"/></Link>}
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
                        {AuthClient.ACCESS_TOKEN !== null ? <Link to="/profile">Профиль</Link> :
                            <Link to="/login">Войти</Link>}
                    </a>
                </div>
            </nav>
        </header>)
    }
}

export default ApplicationHeader;
