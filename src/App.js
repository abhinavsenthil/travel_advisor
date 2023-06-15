import React, { useState, useEffect } from 'react';
import Header from './Components/Header/Header';
import List from './Components/List/List';
import PlaceDetails from './Components/PlaceDetails/PlaceDetails';
import Map from './Components/Map/Map';

import { getPlacesData, getWeatherData } from './api';

import { CssBaseline, Grid } from '@material-ui/core';


const App = () => {

    const [places, setPlaces] = useState([]);

    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});
    const [childClicked, setChildClicked] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');

    const [filteredPlaces, setFilteredPlaces] = useState([]);

    const [weathetData, setWeatherData] = useState([])

 

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude}}) => {
            setCoordinates({lat:latitude, lng:longitude});
        })
    }, []);

    useEffect(() =>{
        const filteredPlaces = places.filter((place) => place.rating > rating);
        setFilteredPlaces(filteredPlaces);
    }, [rating]);

    useEffect(() => {
        setIsLoading(true);

        getWeatherData(coordinates.lat, coordinates.lng)
        .then((data) => setWeatherData(data));

        if (coordinates && bounds) {
          getPlacesData(type, bounds.sw, bounds.ne)
            .then((data) => {
              console.log(data);
              setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
              setFilteredPlaces([]);
              setIsLoading(false);

            })
            .catch((error) => {
              console.log(error);
            });
        }
    
      }, [type, bounds]);
      
    

    return (
        <>
            <CssBaseline />
            <Header setCoordinates = {setCoordinates} />
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List 
                        places={filteredPlaces.length ? filteredPlaces : places}
                        childClicked = {childClicked}
                        isLoading = {isLoading}
                        type = {type}
                        rating = {rating}
                        setType = {setType}
                        setRating = {setRating} // not a best practice, have to use redux if you need to pass down a component of the list
                         />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map 
                        setCoordinates = {setCoordinates}
                        setBounds = {setBounds}
                        coordinates = {coordinates}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        setChildClicked = {setChildClicked}
                        weatherData = {weathetData}
                        //only sent one level deep, if more, use redux
                    />
                </Grid>
            </Grid>

        </>
    );
}

export default App;
