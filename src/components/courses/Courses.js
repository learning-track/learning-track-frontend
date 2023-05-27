import * as React from "react";

import './Courses.css';

import ApplicationHeader from "../applicationheader/ApplicationHeader";
import CourseDTO from "../../dto/CourseDTO";
import ApiClient from "../../services/ApiClient";
import {FadeLoader} from "react-spinners";
import {Navigate} from "react-router-dom";

class Courses extends React.Component {

    courses: CourseDTO[] = [];
    courseChosenId = null;

    constructor() {
        super();

        this.state = {
            coursesLoaded: false, courseChosen: false
        };

        ApiClient.getCourses().then(res => {
            if (res.ok) {
                res.json().then(json => {
                    for (let index = 0; index < json['content'].length; index++) {
                        let newCourse = new CourseDTO()
                        newCourse.id = json['content'][index].id;
                        newCourse.title = json['content'][index].title;
                        newCourse.description = json['content'][index].description;
                        newCourse.externalLink = json['content'][index].externalLink;
                        newCourse.imageUrl = json['content'][index].imageUrl;
                        newCourse.category = json['content'][index].category;
                        newCourse.price = json['content'][index].price;
                        newCourse.headline = json['content'][index].headline;
                        newCourse.rating = Number(json['content'][index].rating).toFixed(2);
                        newCourse.completed = json['content'][index].completed;
                        newCourse.liked = json['content'][index].liked;
                        this.courses.push(newCourse)
                    }
                    console.log(this.courses)
                    this.setState({
                        coursesLoaded: true
                    })
                })
            } else {
                console.log("Error")
            }
        });

        this.handleSubmitResult = this.handleSubmitResult.bind(this);
    }

    handleSubmitResult(event) {
        this.courseChosenId = event.currentTarget.getAttribute("data-value1")

        this.setState({
            courseChosen: true
        })
    }

    render() {
        let coursesRender = []
        for (let i = 0; i < this.courses.length; i += 3) {
            coursesRender.push((<div className="row">
                <div className="col-1-of-3">
                    <div className="card">
                        <div className="card__side card__side--front-1">
                            <div className="card__title card__title--1">
                                {/*<i className="fas fa-paper-plane"></i>*/}
                                <img loading="lazy" alt="" src={this.courses[i].imageUrl}/>
                            </div>
                            <div className="card__details">
                                <ul>
                                    <li>{this.courses[i].title}</li>
                                    <li>Категория: {this.courses[i].category}</li>
                                    <li>Стоимость: {this.courses[i].price}</li>
                                    <li>{this.courses[i].headline}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="card__side card__side--back card__side--back-1">
                            <div className="card__cta">
                                <div className="card__price-box">
                                    <p className="card__price-only">Средняя оценка:</p>
                                    <p className="card__price-value">{this.courses[i].rating} / 5</p>
                                </div>
                                <a href="#popup" className="btn btn--white" data-value1={this.courses[i].id}
                                   onClick={this.handleSubmitResult}>Подробнее</a>
                                <a href={this.courses[i].externalLink} className="btn btn--white">Ссылка на курс</a>
                            </div>
                        </div>
                    </div>
                </div>
                {i + 1 <= this.courses.length - 1 ? <div className="col-1-of-3">
                    <div className="card">
                        <div className="card__side card__side--front-2">
                            <div className="card__title card__title--2">
                                {/*<i className="fas fa-plane"></i>*/}
                                <img loading="lazy" alt="" src={this.courses[i + 1].imageUrl}/>
                            </div>

                            <div className="card__details">
                                <ul>
                                    <li>{this.courses[i + 1].title}</li>
                                    <li>Категория: {this.courses[i + 1].category}</li>
                                    <li>Стоимость: {this.courses[i + 1].price}</li>
                                    <li>{this.courses[i + 1].headline}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="card__side card__side--back card__side--back-2">
                            <div className="card__cta">
                                <div className="card__price-box">
                                    <p className="card__price-only">Средняя оценка:</p>
                                    <p className="card__price-value">{this.courses[i + 1].rating} / 5</p>
                                </div>
                                <a href="#popup" className="btn btn--white" data-value1={this.courses[i + 1].id}
                                   onClick={this.handleSubmitResult}>Подробнее</a>
                                <a href={this.courses[i + 1].externalLink} className="btn btn--white">Ссылка на курс</a>
                            </div>
                        </div>
                    </div>
                </div> : null}
                {i + 2 <= this.courses.length - 1 ? <div className="col-1-of-3">
                    <div className="card">
                        <div className="card__side card__side--front-3">
                            <div className="card__title card__title--3">
                                {/*<i className="fas fa-rocket"></i>*/}
                                <img loading="lazy" alt="" src={this.courses[i + 2].imageUrl}/>
                            </div>

                            <div className="card__details">
                                <ul>
                                    <li>{this.courses[i + 2].title}</li>
                                    <li>Категория: {this.courses[i + 2].category}</li>
                                    <li>Стоимость: {this.courses[i + 2].price}</li>
                                    <li>{this.courses[i + 2].headline}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="card__side card__side--back card__side--back-3">
                            <div className="card__cta">
                                <div className="card__price-box">
                                    <p className="card__price-only">Средняя оценка:</p>
                                    <p className="card__price-value">{this.courses[i + 2].rating} / 5</p>
                                </div>
                                <a href="#popup" className="btn btn--white" data-value1={this.courses[i + 2].id}
                                   onClick={this.handleSubmitResult}>Подробнее</a>
                                <a href={this.courses[i + 2].externalLink} className="btn btn--white">Ссылка на курс</a>
                            </div>
                        </div>
                    </div>
                </div> : null}
            </div>))

            coursesRender.push(<br/>)
        }

        if (this.state.courseChosen) {
            return (<Navigate to={'/course/' + this.courseChosenId}/>);
        }

        return (<div>
            <ApplicationHeader/>
            <div className="Articles">
                <h3 type="articles_page_title">Курсы</h3>
                {this.state.coursesLoaded ? coursesRender : (
                    <Loader styles={{position: "absolute", top: "50%", left: "50%",}}/>)}
            </div>
        </div>)
    }
}

function Loader({styles = {}}) {
    return <FadeLoader color="#426a5a" css={styles}/>;
}

export default Courses;
