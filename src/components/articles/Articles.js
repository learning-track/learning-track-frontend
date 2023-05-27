import * as React from "react";
import {FadeLoader} from "react-spinners";
import {Navigate} from "react-router-dom";

import './Articles.css';

import ApiClient from "../../services/ApiClient";
import ArticleDTO from "../../dto/ArticleDTO";
import ApplicationHeader from "../applicationheader/ApplicationHeader";

class Articles extends React.Component {

    articles: ArticleDTO[] = [];
    articleChosenId = null;

    constructor() {
        super();

        this.state = {
            articlesLoaded: false, articleChosen: false
        };

        ApiClient.getArticles().then(res => {
            if (res.ok) {
                res.json().then(json => {
                    for (let index = 0; index < json.length; index++) {
                        let newArticle = new ArticleDTO()
                        newArticle.id = json[index].id;
                        newArticle.title = json[index].title;
                        newArticle.description = json[index].description;
                        newArticle.date = json[index].date;
                        newArticle.content = json[index].content;
                        newArticle.category = json[index].category;
                        newArticle.tags = json[index].tags;
                        newArticle.read = json[index].read;
                        this.articles.push(newArticle)
                    }
                    console.log(this.articles)
                    this.setState({
                        articlesLoaded: true
                    })
                })
            } else {
                console.log("Error")
            }
        });

        this.handleSubmitResult = this.handleSubmitResult.bind(this);
    }

    handleSubmitResult(event) {
        this.articleChosenId = event.currentTarget.getAttribute("data-value1")

        this.setState({
            articleChosen: true
        })
    }

    render() {
        let articlesRender = []
        for (let i = 0; i < this.articles.length; i += 3) {
            articlesRender.push((<div className="row">
                <div className="col-1-of-3">
                    <div className="card">
                        <div className="card__side card__side--front-1">
                            <div className="card__title card__title--1">
                                <i className="fas fa-paper-plane"></i>
                                <h4 className="card__heading">{this.articles[i].title}</h4>
                            </div>
                            <div className="card__details">
                                <ul>
                                    <li>1 Website</li>
                                    <li>50 GB SSD Storage</li>
                                    <li>Unmetered Bandwidth</li>
                                    <li>Free SSL Certificate</li>
                                    <li>1 Included Domain</li>
                                    <li>1 Included Domain</li>
                                </ul>
                            </div>
                        </div>
                        <div className="card__side card__side--back card__side--back-1">
                            <div className="card__cta">
                                <div className="card__price-box">
                                    <p className="card__price-only">Only</p>
                                    <p className="card__price-value">$2.95/mo*</p>
                                </div>
                                <a href="#popup" className="btn btn--white" data-value1={this.articles[i].id}
                                   onClick={this.handleSubmitResult}>Подробнее</a>
                            </div>
                        </div>
                    </div>
                </div>
                {i + 1 <= this.articles.length - 1 ? <div className="col-1-of-3">
                    <div className="card">
                        <div className="card__side card__side--front-2">
                            <div className="card__title card__title--2">
                                <i className="fas fa-plane"></i>
                                <h4 className="card__heading">{this.articles[i + 1].title}</h4>
                            </div>

                            <div className="card__details">
                                <ul>
                                    <li>Includes Basic Package Features</li>
                                    <li>Unlimited Websites</li>
                                    <li>Unlimited SSD Storage</li>
                                    <li>Unlimited Domains</li>
                                    <li>Unlimited Parked Domains</li>
                                    <li>Unlimited Sub Domains</li>
                                </ul>
                            </div>
                        </div>
                        <div className="card__side card__side--back card__side--back-2">
                            <div className="card__cta">
                                <div className="card__price-box">
                                    <p className="card__price-only">Only</p>
                                    <p className="card__price-value">$5.45/mo*</p>
                                </div>
                                <a href="#popup" className="btn btn--white"
                                   data-value1={this.articles[i].id + 1}
                                   onClick={this.handleSubmitResult}>Подробнее</a>
                            </div>
                        </div>
                    </div>
                </div> : null}
                {i + 2 <= this.articles.length - 1 ? <div className="col-1-of-3">
                    <div className="card">
                        <div className="card__side card__side--front-3">
                            <div className="card__title card__title--3">
                                <i className="fas fa-rocket"></i>
                                <h4 className="card__heading">{this.articles[i + 2].title}</h4>
                            </div>

                            <div className="card__details">
                                <ul>
                                    <li>Includes Plus Plan Features</li>
                                    <li>High Performance</li>
                                    <li>2 Spam Experts</li>
                                    <li>Free SSL Certificate</li>
                                    <li>Domain Privacy</li>
                                    <li>Site Backup - CodeGuard Basic</li>
                                </ul>
                            </div>
                        </div>
                        <div className="card__side card__side--back card__side--back-3">
                            <div className="card__cta">
                                <div className="card__price-box">
                                    <p className="card__price-only">Only</p>
                                    <p className="card__price-value">$13.95/mo</p>
                                </div>
                                <a href="#popup" className="btn btn--white"
                                   data-value1={this.articles[i].id + 2}
                                   onClick={this.handleSubmitResult}>Подробнее</a>
                            </div>
                        </div>
                    </div>
                </div> : null}
            </div>))

            articlesRender.push(<br/>)
        }

        if (this.state.articleChosen) {
            return (<Navigate to={'/article/' + this.articleChosenId}/>);
        }

        return (<div>
            <ApplicationHeader/>
            <div className="Articles">
                <h3 type="articles_page_title">Articles</h3>
                {this.state.articlesLoaded ? articlesRender : (
                    <Loader styles={{position: "absolute", top: "50%", left: "50%",}}/>)}
            </div>
        </div>)
    }
}

function Loader({styles = {}}) {
    return <FadeLoader color="#426a5a" css={styles}/>;
}

export default Articles;
