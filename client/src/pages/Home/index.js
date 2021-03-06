import React, { Component } from 'react'
import { Header, Message, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Api from "../../components/Api";
import "./style.css";
import $ from "jquery"
import SongResults from '../../components/SongResults';
import SpotifyResults from '../../components/SpotifyResults';
import Jumbotron from '../../components/Jumbotron';


export const Home = () => {
    // access to the isAuthenticated property from the auth reducer state
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    const showLoginBtn = () => {
        if (!isAuthenticated) {
            return (
                <Button color="black" animated secondary>
                    <Button.Content visible>Login</Button.Content>
                    <Button.Content hidden>
                        <Icon name='arrow right' />
                    </Button.Content>
                </Button>
            )
        }
    }

    return (

        <div className="waveWrapper waveAnimation">
            <div className="waveWrapperInner bgTop">
                <div className="wave waveTop" style={{ backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-top.png')" }}></div>
            </div>
            <div className="waveWrapperInner bgMiddle">
                <div className="wave waveMiddle" style={{ backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-mid.png')" }}></div>
            </div>
            <div className="waveWrapperInner bgBottom">
                <div className="wave waveBottom" style={{ backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-bot.png')" }}></div>
            </div>
            <div className="col-12 waveContainer" >
                <Router>
                    <div className="jumbotron-fluid" style={{ margin: "50px" }}>
                        <div className="container">
                        <h1 className="display-4"
                            style={{
                                // backgroundColor: "transparent",
                                textAlign: "center",
                                fontFamily: "'Fjalla One', sans-serif",
                                fontSize: "80px",
                                fontWeight: "bold",
                                color: "gry"
                            }}>
                            Sweater Weather
                    </h1>
                    </div>
                    </div>
                    {/* switch keeps pages from loading at same time */}
                    <Switch>
                        <Route exact path="/" component={Api} />
                    </Switch>
                </Router>
            </div>
        </div>

    )
};

export default Home;