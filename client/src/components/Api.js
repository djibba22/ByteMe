import React, { useState, useEffect, useCallback } from 'react'
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import { useDispatch } from "react-redux";
import { loadUser } from "../actions/authActions";
import NavBar from "./NavBar";
import Home from "../pages/Home";
import UserDashboard from "../pages/UserDashboard";
import PageOne from "../pages/PageOne";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import NoMatch from "../pages/NoMatch";
import axios from "axios";
import SearchForm from "./SearchForm";
import SpotifyResults from "./SpotifyResults"
import SongResults from './SongResults'
import API from "../utils/API";
// import Deletebtn from "../components/DeleteBTN"
import ZipInput from './ZipInput';
import Playlist from "../pages/Playlist/index"
import PlayerApp from "../components/PlayerApi"
import { authEndpoint, clientId, redirectUri, scopes } from "./config";



function Api() {
  const [search, setSearch] = useState("");
  const [weatherResults, setWeatherResults] = useState("");
  const [spotifyResults, setSpotifyResults] = useState([]);
  const [zipCode, setZipCode] = useState("");
  const [newArtist, setnewArtist] = useState()
  const [song, setNewSong] = useState([])
  const [playlist, setPlaylist] = useState([])


  //Hide and show element on zipcode on click

  const handleZipInputChange = event => {
    let zipValue = event.target.value;
    setZipCode(zipValue);
    event.preventDefault();
  }

  const handleZip = () => {
    changeZip(zipCode)
  }

  //spotifysearchBTN
  const handleSearch = event => {
    event.preventDefault()
    fetchData(search)
  }
  const handleSong = event => {
    event.preventDefault()
    fetchSong(search)
  }

  //will handle the filtering of first or last name
  const handleInputChange = event => {
    // Getting the value and name of the input which triggered the change
    let value = event.target.value;
    setSearch(value)
  };


  // starting Spotify ajax work
  const fetchData = (search) => {
    axios({
      //get token
      method: 'post',
      url: 'https://accounts.spotify.com/api/token?grant_type=client_credentials',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ZmM5NzkyYzNkOWU0NGRmODk1NjM4OTY1YmZmOGI4MGI6NmE2OTYwODNkNDMwNDM5ZGJmMGNmNTRjZDg2MTYyMGY=',
      },
      data: ""
    })
      .then((data) => {
        spotifySearch(data, search)
      });
  };

  const spotifySearch = (res, search) => {
    var token = res.data.access_token
    console.log(token);

    //another axios get to search with the token(BQBJZeaaEsHYfSeM7ndR7uDcA2IyenVdLq-q9uFHp2V_CTdVl2NQdyGuxG0TdQy0H9cYGR0ntu-yYw7bh04)
    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/search?q=' + search + '&type=artist',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': ('Bearer ' + token)
      },
      data: ""
    })
      .then((res) => {
        //set spotify results to get results for table
        setSpotifyResults(res.data);

      })
      .catch((error) => {
        console.log(error);
      })
  }

  const fetchSong = (search) => {
    axios({
      //get token
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token?grant_type=client_credentials',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ZmM5NzkyYzNkOWU0NGRmODk1NjM4OTY1YmZmOGI4MGI6NmE2OTYwODNkNDMwNDM5ZGJmMGNmNTRjZDg2MTYyMGY=',
      },
      data: ""
    })
      .then((data) => {
        songSearch(data, search)

      });
    const songSearch = (res, search) => {
      var token = res.data.access_token
      console.log(token);

      //another axios get to search with the token(BQBJZeaaEsHYfSeM7ndR7uDcA2IyenVdLq-q9uFHp2V_CTdVl2NQdyGuxG0TdQy0H9cYGR0ntu-yYw7bh04)
      axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/search?q=' + search + '&type=track',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': ('Bearer ' + token)
        },
        data: ""
      })
        .then((res) => {
          //set spotify results to get results for table
          setNewSong(res.data);
        })
        .catch((error) => {
          console.log(error);
        })
    }

  }
  //call song to pass to db
  const handleAddSong = song => {
    console.log("+++++++++++++==========================================", song)
    API.savePlaylist(song)
  };


  //starting weather ajax
  const weatherSearch = () => {
    //weather API Call
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude
        let lon = position.coords.longitude
        console.log("Latitude is :", lat);
        console.log("Longitude is :", lon);

        axios({
          method: 'get',
          url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=e971f7deaf07913de154d7e7ed5455c5&units=imperial",
        })
          .then((res) => {
            let results = res.data
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", results.list[0].weather[0].main)
            if (results?.length !== 0) {
              let result = (results?.list[0].weather[0].main)
              setWeatherResults(result)
            }
          })
          .catch((error) => {
            console.log(error);
          })
      })
    }
  }

  // const handleAddWeather = zipCode => {
  //   console.log("&&&&&+++++++++++++===================================", zipCode)
  //   API.postWeather(zipCode)
  // };

  const changeZip = (zipCode) => {
    console.log("THIS IS NEW ZIP", zipCode)
    axios({
      method: 'get',
      url: "https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + ",us&appid=e971f7deaf07913de154d7e7ed5455c5&units=imperial",
    })
      .then((res) => {
        let newZipRes = (res.data)
        console.log("??????????????????///////////////////////////////////////////||||||||||||||||||||||||||||||||||||", newZipRes.weather[0].main)
        setZipCode(newZipRes)
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",results.list[0].weather[0].main)
        if (handleZip) {
          setWeatherResults(newZipRes.weather[0].main)
        }
      })
      .catch((error) => {
        console.log(error);
      })
    console.log("new zipcode weather", setZipCode)
  }
  console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++WEATHER RESULTS", zipCode)

  useEffect(() => {
    weatherSearch()
  }, [])


  return (

    <div>
      <SearchForm
        handleInputChange={handleInputChange}
        handleSearch={handleSearch}
        handleSong={handleSong}
        search={search}
        song={song}
      />

      <ZipInput
        handleZip={handleZip}
        handleZipInputChange={handleZipInputChange}
        weatherResults={weatherResults}
        zipCode={zipCode}
      />

      {/* <SpotifyResults
        spotifyResults={spotifyResults}
      /> */}
      <SongResults
        song={song}
        handleAddSong={handleAddSong}
        weatherResults={weatherResults}
        zipCode={zipCode}

      />
      

      
    </div>
  )
};

export default Api; 