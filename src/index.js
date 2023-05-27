import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route, useParams} from "react-router-dom";

import './index.css';

import Article from "./components/articles/Article";
import Articles from "./components/articles/Articles";
import Auth from "./components/auth/Auth";
import Course from "./components/courses/Course";
import Courses from "./components/courses/Courses";
import Job from "./components/vacancies/Job";
import Skills from "./components/skills/Skills";
import Track from "./components/track/Track";
import UserProfile from "./components/profile/Profile";

const Wrapper = (props) => {
    const params = useParams();
    return <Article {...{...props, match: {params}}} />
}

const CourseWrapper = (props) => {
    const params = useParams();
    return <Course {...{...props, match: {params}}} />
}

const JobWrapper = (props) => {
    const params = useParams();
    return <Job {...{...props, match: {params}}} />
}

ReactDOM.render(<BrowserRouter>
    <Routes>
        <Route path="/" element={<UserProfile/>}/>
        <Route path="skills" element={<Skills/>}/>
        <Route path="auth" element={<Auth/>}/>
        <Route path="login" element={<Auth/>}/>
        <Route path="register" element={<Auth/>}/>
        <Route path="login-or-register" element={<Auth/>}/>
        <Route path="profile" element={<UserProfile/>}/>
        <Route path="articles" element={<Articles/>}/>
        <Route path="article/:id" element={<Wrapper/>}/>
        <Route path="track" element={<Track/>}/>
        <Route path="courses" element={<Courses/>}/>
        <Route path="course/:id" element={<CourseWrapper/>}/>
        <Route path="job/:id" element={<JobWrapper/>}/>
    </Routes>
</BrowserRouter>, document.getElementById('root'));
