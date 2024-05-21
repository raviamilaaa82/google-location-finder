import React from 'react';

import { GoogleMap,Marker,DirectionsRenderer,Circle,MarkerClusterer,useLoadScript} from '@react-google-maps/api';
import Map from './Map';

const Home = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],

    })
    if(!isLoaded) return <div>Loading....</div>
    return (
        <div><Map/></div>
    )
}
export default Home;