import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import fire from '../config/fire';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';



function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 1000,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function ShippingPaper(){
  const [data, setData] = useState([])
  const [companyID, setCompanyID] = useState([])
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const GoogleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


   
  const locations = [
    {
      name: "Location 1",
      location: { 
        lat: 31.000000, lng: -100.000000
      },
    },
    {
      name: "Location 2",
      location: { 
        lat: 41.3917,
        lng: 2.1649
      },
    },
    {
      name: "Location 3",
      location: { 
        lat: 41.3773,
        lng: 2.1585
      },
    },
    {
      name: "Location 4",
      location: { 
        lat: 41.3797,
        lng: 2.1682
      },
    },
    {
      name: "Location 5",
      location: { 
        lat: 41.4055,
        lng: 2.1915
      },
    }
  ];

  const mapStyles = {        
    height: "400px",
    width: "100%"};
  
  const defaultCenter = {
    lat: 31.000000, lng: -100.000000
  }
  
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
     <LoadScript
       googleMapsApiKey={GoogleMapsKey}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={10}
          center={defaultCenter}
          
        />
        <Marker
        key={center.id}
        position={{
            lat: 31.000000,
            lng: -100.000000
        }}
        onClick={() => {
            setSelectedCenter(center);
        }}
      />
        
     </LoadScript>
    </div>
  );
  const additem = (incoming, resolve) => {
      
     //validation
  let errorList = []
  if(incoming.datanumber === undefined){
    errorList.push("Please enter first name")
  }
  if(incoming.createdby === undefined){
    errorList.push("Please enter first name")
  }
  if(incoming.originwarehousenumber === undefined){
    errorList.push("Please enter last name")
  }
  if(incoming.destinationwarehousenumber === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.trucknumber === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.gps === undefined){
    errorList.push("Please enter a valid email")
  }
  if(errorList.length < 1){
    let dataToAdd =[];
    dataToAdd.push(incoming);
    console.log(dataToAdd);
    
          fire 
          .firestore()
          .collection('asset_data').add({
            "datanumber": dataToAdd[0].datanumber,
            "createdby": dataToAdd[0].createdby,
            "originwarehousenumber": dataToAdd[0].originwarehousenumber,
            "destinationwarehousenumber": dataToAdd[0].destinationwarehousenumber,
            "trucknumber": dataToAdd[0].trucknumber,
            "comments": dataToAdd[0].comments,
            "gps": dataToAdd[0].gps,
            type: "shipping_papers"
          })
          .then(function(){
            resolve()
            console.log("Document successfully written!");
          })
          .catch(function(error){
            console.error("Error writing document: ", error);
            resolve()
          })
  }
};
const updateitem = (oldincoming, incoming, resolve) => {
 
  //validation
let errorList = []
if(incoming.datanumber === undefined){
  errorList.push("Please enter first name")
}
if(incoming.createdby === undefined){
  errorList.push("Please enter first name")
}
if(incoming.originwarehousenumber === undefined){
  errorList.push("Please enter last name")
}
if(incoming.destinationwarehousenumber === undefined){
  errorList.push("Please enter a valid email")
}
if(incoming.trucknumber === undefined){
  errorList.push("Please enter a valid email")
}
if(incoming.gps === undefined){
  errorList.push("Please enter a valid email")
}
if(errorList.length < 1){
 let dataToAdd =[];
 dataToAdd.push(incoming);
       fire 
       .firestore()
       .collection('asset_data').doc(oldincoming.id).update({
            "datanumber": dataToAdd[0].datanumber,
            "createdby": dataToAdd[0].createdby,
            "originwarehousenumber": dataToAdd[0].originwarehousenumber,
            "destinationwarehousenumber": dataToAdd[0].destinationwarehousenumber,
            "trucknumber": dataToAdd[0].trucknumber,
            "comments": dataToAdd[0].comments,
            "gps": dataToAdd[0].gps,
            type: "shipping_papers"
       })
       .then(function(){
         resolve()
         console.log("Document successfully written!");
       })
       .catch(function(error){
         console.error("Error writing document: ", error);
         resolve()
       })
}
};


const removeitem = (incoming, resolve) => {
  fire 
      .firestore()
      .collection('assets').doc(incoming.id).delete()
      .then(function(){
        resolve()
        console.log("Document successfully written!");
      })
      .catch(function(error){
        resolve()
        console.error("Error writing document: ", error);
      });
};



const openmap = (event, rowData) => {

  setOpen(true);
};

  useEffect(() => {
    fire
      .firestore()
      .collection('asset_data').where('type', '==', 'shipping_papers')
      .onSnapshot((snapshot) => {
        const newTimes = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        setData(newTimes)
      })
  }, [])

    //console.log(data)
  
    const history = useHistory(); 
    function test(data, rowdata) {
      let id = rowdata;
      setCompanyID(rowdata.id)
      history.push({
        pathname: '/shippingchemicals',
        state: id
      });
      
    }
 
  
    const [state, setState] = React.useState({
        columns: [
          {title: "id", field: "id", hidden: true},
          {title: "Data Number", field: "datanumber",},
          {title: "Created By", field: "createdby"},
          {title: "Origin Warehouse Number", field: "originwarehousenumber"},
          {title: "Destination Number", field: "destinationwarehousenumber"},
          {title: "Truck Number", field: "trucknumber"},
          {title: "Comments", field: "comments"},
          {title: "Location", field: "gps"}
        ]
        
      });
      





    return (
      
      
      
      <div>
        <MaterialTable
      onRowClick={openmap}
      title="Shipping Papers"
      columns={state.columns}
      data={data}
      editable={{
        onRowAdd: (newData) =>
        new Promise((resolve) => {
        additem(newData,resolve);
    }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            
            updateitem(oldData, newData,resolve);
            
          }),
        onRowDelete: (oldData) =>
          
          new Promise((resolve) => {
            
            removeitem(oldData,resolve);
          }),
      }}
      actions={[
        {
          icon: 'science',
          tooltip: 'Save User',
          onClick: (event, rowData) => test(event, rowData)
            
        
        }]}
        
    />
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
    );
    
}

export default ShippingPaper;