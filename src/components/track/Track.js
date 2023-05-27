import * as React from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {useSpring, animated as a} from "react-spring"
import HashLoader from "react-spinners/HashLoader";

import './Track.css';

import ApiClient from "../../services/ApiClient";
import ApplicationHeader from "../applicationheader/ApplicationHeader";
import AuthClient from "../../services/AuthClient";
import {TrackDTO} from "../../dto/TrackDTO";
import {TrackStepDTO} from "../../dto/TrackStepDTO";

class Track extends React.Component {

    track: TrackDTO = new TrackDTO();

    constructor(props) {
        super(props);

        this.state = {
            trackLoaded: false,
            trackGenerating: false,
            errorMessage: ""
        };

        this.requestTrack();

        this.handleGenerateTrackButton = this.handleGenerateTrackButton.bind(this);
    }

    handleGenerateTrackButton() {
        this.setState({
            trackGenerating: true
        });
        ApiClient.generateNewTrack().then(res => {
            if (res.status === 200) {
                this.requestTrack();
            } else if (res.status === 204) {
                this.setState({errorMessage: "Unable to generate a track. Try change your skills or desired position"})
                this.requestTrack();
                setTimeout(() => this.setState({errorMessage: ""}), 10000);
            } else {
                this.setState({errorMessage: "Error occurred"})
                this.requestTrack();
                setTimeout(() => this.setState({errorMessage: ""}), 10000);
                console.log("Error")
            }
        });
    }

    getMaterialType(type) {
        switch (type) {
            case "job":
                return "Вакансия"
            case "article":
                return "Статья"
            case "course":
                return "Курс"
            default:
                return type
        }
    }

    requestTrack() {
        ApiClient.getLatestTrack().then(res => {
            if (res.ok) {
                res.json().then(json => {
                    console.log(json)
                    this.track = new TrackDTO();
                    this.track.trackId = json.trackId;
                    this.track.destination = json.destination;
                    if (json.trackSteps != null) {
                        for (let index = 0; index < json.trackSteps.length; index++) {
                            let trackStep: TrackStepDTO = new TrackStepDTO();
                            trackStep.completed = json.trackSteps[index].completed;
                            trackStep.stepOrderNumber = json.trackSteps[index].stepOrderNumber;
                            trackStep.trackStepId = json.trackSteps[index].trackStepId;

                            trackStep.material.id = json.trackSteps[index].material.id;
                            trackStep.material.learningMaterialType = json.trackSteps[index].material.learningMaterialType
                            trackStep.material.learningMaterialTypeDisplay = this.getMaterialType(json.trackSteps[index].material.learningMaterialType);
                            trackStep.material.description = json.trackSteps[index].material.description;
                            trackStep.material.title = json.trackSteps[index].material.title;

                            this.track.addTrackStep(trackStep);
                        }

                        this.track.trackSteps.sort((a, b) => {
                            return a.stepOrderNumber > b.stepOrderNumber
                        })
                    }
                    console.log(this.track)
                    this.setState({
                        trackLoaded: true
                    })
                })
            } else {
                console.log("Error")
            }
        });
        this.setState({
            trackGenerating: false
        });
    }

    render() {
        if (AuthClient.ACCESS_TOKEN == null) {
            return (<Navigate to='/login'/>)
        }

        return (
            <div>
                <ApplicationHeader/>

                <div className="Track">
                    {this.state.errorMessage !== "" ? (<NotificationError text={this.state.errorMessage}/>) : null}
                    {(this.state.trackGenerating) ?
                        <button className="GenerateTrackButton GenerateTrackBeingGeneratedButton"
                                disabled={true}>
                            Генерация трека...
                        </button>
                        :
                        <button className="GenerateTrackButton"
                                onClick={this.handleGenerateTrackButton}>
                            Сгенерировать новый трек
                        </button>
                    }
                    {this.state.trackLoaded && !this.state.trackGenerating
                        ? (<div>
                            <div className="container"><ComponentTrackView track={this.track}/></div>
                            <div className="container"><ComponentTrackView track={this.track}/></div>
                        </div>)
                        : this.state.trackGenerating
                            ? (<SpinnerView/>)
                            : null
                    }
                </div>
            </div>
        )
    }

}

function SpinnerView() {
    return (
        <HashLoader size={180} color={"purple"}/>
    )
}

export function NotificationError(props) {
    const contentProps = useSpring({
        from: {opacity: 0},
        to: {opacity: 1}
    });
    return (
        <a.div style={contentProps}>
            <div className="NotificationError">
                <label className="NotificationErrorLabel">
                    {props.text}
                </label>
            </div>
        </a.div>
    )
}

function ComponentTrackView(props) {
    let trackRender = []
    let navigate = useNavigate();

    trackRender.push(
        (
            <div id="trackDest" className="TrackStep TrackDest">
                <div className="TrackStepContent">
                    <label className="TrackStepTitle"> {props.track.destination}</label>
                </div>
            </div>
        ))

    for (let index = 0; index < props.track.trackSteps.length; index++) {
        trackRender.push((
            <div className="track-item"
                 onClick={() => {
                     navigate('/' + props.track.trackSteps[index].material.learningMaterialType + '/' + props.track.trackSteps[index].material.id);
                 }}>
                <div className="track-title">{props.track.trackSteps[index].material.title}</div>
                <div
                    className="track-description">{props.track.trackSteps[index].material.description.substring(0, 100)}</div>
                <div
                    className={props.track.trackSteps[index].completed ? "track-status status-completed" : "track-status status-not-completed"}>{props.track.trackSteps[index].completed ? "Курс пройден" : "Курс не пройден"}</div>
            </div>
        ))
    }


    const contentProps = useSpring({
        from: {opacity: 0},
        to: {opacity: 1}
    });
    return (
        <a.div style={contentProps}>
            <div className="TrackView">
                {trackRender}
            </div>
        </a.div>
    )
}

export default Track;
