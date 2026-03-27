import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const defaultCenter = {
  lat: 31.9686,
  lng: -99.9018,
};


export default function Orders() {
  
  const GoogleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [marks] = useState([])

  useEffect(() => {
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








  const mapStyles = {
    width: '100%',
    height: 'clamp(260px, 42vh, 420px)',
    borderRadius: '12px',
  };


  return (
    <React.Fragment>
      {GoogleMapsKey ? (
        <LoadScript
         id= "Deliveries"
           googleMapsApiKey={GoogleMapsKey}>
            <GoogleMap
            id="marker-example"
            mapContainerStyle={mapStyles}
            zoom={5}
             center={defaultCenter}
             options={{
              fullscreenControl: false,
              mapTypeControl: false,
              streetViewControl: false,
            }}
          >

            { marks.map((mark, index) => (

                    <Marker
                    key = {index}
                    position={mark}
                    />


                  ))}

          </GoogleMap>


         </LoadScript>
      ) : (
        <div style={{...mapStyles, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0'}}>
          <span>Map unavailable – no API key configured</span>
        </div>
      )}
    </React.Fragment>
  );
}