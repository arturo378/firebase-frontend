import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';


import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import fire from '../config/fire';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}



function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));


export default function Orders() {
  
  const GoogleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const classes = useStyles();
  const [position, setPosition] = useState({})
  const [marks, setLocations] = useState([])

  useEffect(() => {
    var locations = [];
    // fire
    //   .firestore()
    //   .collection('assets').where('type', '==', 'well')
    //   .onSnapshot((snapshot) => {
    //     var newTimes = snapshot.docs.map(((doc) => ({
    //       id: doc.id,
    //       ...doc.data()
    //     })))
    //     for (var key in newTimes) {
          
    //       var gpsdat = (newTimes[key].gps).split(',');

    //       locations[key] = {
    //         lat: parseFloat(gpsdat[0]),
    //         lng: parseFloat(gpsdat[1])
    //       };
    //     }
    //     if(locations){
    //       setLocations(locations)
    //     }
        
        
        
    //   })
      
      
  }, [])








  const onLoad = marker => {
    setPosition({
      lat: 31.9686,
    lng: -99.9018
  })
  }
  const mapStyles = {        
    height: "400px",
    width: "100%"};


  return (
    <React.Fragment>
      <LoadScript
       id= "Deliveries"
         googleMapsApiKey={GoogleMapsKey}>
          <GoogleMap
          id="marker-example"
          mapContainerStyle={mapStyles}
          zoom={5}
           center={position}
        >

          { marks.map((mark, index) => (

                  <Marker
                  key = {index}

                  onLoad={onLoad}
                  position={mark}
                  />
                  
                  
                ))}
          
        </GoogleMap>
          
          
       </LoadScript>
    </React.Fragment>
  );
}