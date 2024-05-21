import React from 'react';
import { useState, useMemo, useCallback, useRef } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, Circle, MarkerClusterer, useLoadScript, InfoWindow } from '@react-google-maps/api';
import Places from './Places';
import Distance from './Distance';
import '../App.css';

//
//lat: 43.45, lng: -80.49
let c=0;
const Map = () => {
    const [office,setOffice]=useState(null);
    const [direction,setDirection]=useState(null);
    const [nearbyResult,setNearbyResult]=useState([]);
     const [places,setPlaces]=useState("school");
     const [selected,setSelected]=useState(null);
     const [showNameInfoWindow,setShowNameInfoWindow]=useState('');
     const [showImageInfoWindow,setShowImageInfoWindow]=useState(null);
    const mapRef=useRef();
    const google = window.google;
    const LatLngLiteral = google.maps.LatLngLiteral;
    const DirectionResult = google.maps.DirectionsRenderer;
    const MapOptions = google.maps.MapOptions;
    const center = useMemo(() => ({ lat: 6.9337, lng: 79.8500 }), []);
    const option = useMemo (() => ({
        disabledDefaultUI: true,
        clickableIcons: false,
    }), []);

    const onLoad=useCallback((map)=>(mapRef.current=map),[]);
    
 const placeListOnclick=(placeDetails)=>{
     setSelected({lat:placeDetails.geometry.location.lat(),lng:placeDetails.geometry.location.lng()});
      
     setShowNameInfoWindow(placeDetails.name);
     if(placeDetails.photos!== undefined){
        if(placeDetails.photos[0].getUrl()!==null ){
            setShowImageInfoWindow(placeDetails.photos[0].getUrl());
           
    //    console.log(placeDetails.photos[0].getUrl(),);
         }
     }
     
     console.log("placeDetails");
 }
    // const pp=useMemo(()=>generateHouses(center),[center]);
    const nearByPlacesMaker=useMemo(()=>generateHouses(nearbyResult),[nearbyResult]);
    console.log("nearByPlacesMaker");
    console.log(nearByPlacesMaker);
    const nearByPlacesList=nearbyResult.map(nearByPlace=>(<li key={nearByPlace.index} onClick={()=>placeListOnclick(nearByPlace)} style={{cursor: 'pointer'}}>{nearByPlace.name}</li>))

 const fetchDirections = async(orgin)=>{
    // if(direction!=null){
    //     clearRoute();

    // }
    console.log("origin");
    console.log(orgin);
    console.log("destination");
    console.log(office);
if(!office) return;
const service= new google.maps.DirectionsService();
await service.route({
    origin:office,
    destination:orgin,
    travelMode:google.maps.TravelMode.DRIVING,
},
(result,status)=>{
    if(status==='OK' && result){
        
    setDirection(result);
    }
})
// const nservice=new google.maps.places.PlacesService(mapRef.current);
// nservice.nearbySearch({
//      location:orgin,//this center value change need to be change origin (user click value)
//      radius:'1500',
//     type:['school'],
// },(result,status)=>{
//     if(status==='OK' && result){
//     // setDirection(result);
//     console.log("inside service calback");
//     console.log(result);
//      setNearbyResult(result);
//     }
// })
// console.log("places services");
// console.log(nservice);

 }
 function clearRoute() {
    setDirection(null);
    // setDistance('')
    // setDuration('')
    // originRef.current.value = ""
    // destinationRef.current.value = ""
  }
const settingNearByPosition=(position)=>{
    // console.log("setting origi");
    // console.log(position);
    const nservice=new google.maps.places.PlacesService(mapRef.current);
    nservice.nearbySearch({
         location:position,//this center value change need to be change origin (user click value)
         radius:'3000',
        type:[places],
    },(result,status)=>{
        if(status==='OK' && result){
        // setDirection(result);
        // console.log("inside service calback");
        // console.log(result);
         setNearbyResult(result);
        }
    })
}
    return (
        <div className='container'>
            <div className='controls'>
                {/* <h1>Commute?</h1> */}
                <select onChange={(e) => setPlaces(e.target.value)} className='select'>
                    <option value="school">School</option>
                    <option value="atm">ATM</option>
                    <option value="bus_station">Bus Station</option>
                    <option value="museum">Museum</option>
                    <option value="park">Park</option>
                    <option value="bank">Bank</option>
                    <option value="library">Library</option>
                    <option value="police">Police</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="post_office">Post Office</option>
                    <option value="church">Church</option>
                    <option value="doctor">Doctor</option>
                    <option value="gas_station">Gas Station</option>

                </select>
                <br />
                <br />
                <Places setOffice={(position) => {
                    setOffice(position);
                    mapRef.current.panTo(position); settingNearByPosition(position)
                }} />
                {!office && <p>Details</p>}


                {direction && <Distance leg={direction.routes[0].legs[0]} />}
                <br />
                <ul className='list-view'>
                {nearByPlacesList}
                </ul>
            </div>
            <div className='map'>
                {/* ref={mapRef} */}
                <GoogleMap zoom={10} onLoad={onLoad} center={center} mapContainerClassName='map-container' options={option}>
                    {direction && <DirectionsRenderer directions={direction} options={{
                        polylineOptions: {
                            zIndex: 50,
                        }
                    }} />}
                    {office && (
                        <>
                            <Marker position={office} />

                            <MarkerClusterer>
                                {(clusterer) =>
                                    nearByPlacesMaker ? nearByPlacesMaker.map(place => <Marker key={place.index} position={place} clusterer={clusterer} onClick={() => { fetchDirections(place); }} />) : null

                                }
 
                            </MarkerClusterer>
                           
                            {selected ? (<InfoWindow position={{lat:selected.lat,lng:selected.lng}}>
                                <div>
                                    <h5>{showNameInfoWindow}</h5>
                                  {showImageInfoWindow ? <img src={showImageInfoWindow} width={250} height={250}/>:null}  
                                </div>
                            </InfoWindow>) : null}
                            <Circle center={office} radius={10000} options={closeOptions} />
                            <Circle center={office} radius={20000} options={middleOptions} />
                            <Circle center={office} radius={30000} options={farOptions} />
                        </>
                    )}



                </GoogleMap>
            </div>
        </div>
    )
}
export default Map;

const defaultOptions={
    strokeOpacity:0.5,
    strokeWeight:2,
    clickable:false,
    draggable:false,
    editable:false,
    visibility:true,

}
const closeOptions={
    ...defaultOptions,
    zIndex:3,
    fillOpacity:0.05,
    strokeColor:'#8BC34A',
    fillColor:'#8BC34A',

}
const middleOptions={
    ...defaultOptions,
    zIndex:2,
    fillOpacity:0.05,
    strokeColor:'#FBC02D',
    fillColor:'#FBC02D',

}
const farOptions={
    ...defaultOptions,
    zIndex:1,
    fillOpacity:0.05,
    strokeColor:'#FF5252',
    fillColor:'#FF5252',

}


const generateHouses=(position)=>{
    // console.log("from funct");
    // console.log(position);
    // const place=Array<LatLngLiteral>=[];
    const array=[];
    for(let i=0;i<position.length;i++){
        array.push({
            index:position[i].place_id,
        lat:position[i].geometry.location.lat(),
        lng:position[i].geometry.location.lng(),
    }); 
    }
    // console.log("p");
    // console.log(p);
    // var latitude = results[0].geometry.location.lat();
    // var longitude = results[0].geometry.location.lng();
    // p.push({
    //     lat:position.lat,
    //     lng:position.lng,
    // });
    // for(let i=0;i<100;i++){
    //      const direction=Math.random() < 0.5 ? -2:2;
    //     // const direction=1;
    //     p.push({
    //         lat:position.lat+Math.random()/direction,
    //         lng:position.lng+Math.random()/direction,
    //     });
    //     // console.log(direction,"dirrection");
    //     // console.log("inside function");
    //     // console.log(p);
    // }
    
return array;
}