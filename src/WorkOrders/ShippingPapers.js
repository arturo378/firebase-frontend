import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import fire from '../config/fire';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import DateFnsUtils from '@date-io/date-fns';
import moment  from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';


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
  const [position, setPosition] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date());

  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const mapContainerStyle = {
    height: "400px",
    width: "800px"
  }
  const mapStyles = {        
    height: "400px",
    width: "100%"};
  
  const center = {
    lat: 0,
    lng: -180
  }
 
  
  const onLoad = marker => {
    console.log('marker: ', marker)
  }

  

  const body = (
    <div style={modalStyle} className={classes.paper}>
     <LoadScript
     id= "Deliveries"
       googleMapsApiKey={GoogleMapsKey}>
        <GoogleMap
        id="marker-example"
        mapContainerStyle={mapStyles}
        zoom={13}
        center={position}
      >
        <Marker
          onLoad={onLoad}
          position={position}
        />
      </GoogleMap>
        
        
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
            "date": selectedDate,
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
            "date": selectedDate,
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
  var gpsdat = (rowData.gps).split(',');
setPosition({
  lat: parseFloat(gpsdat[0]),
  lng: parseFloat(gpsdat[1])
})

 
  console.log(position)

 if(position != undefined){
  setOpen(true);

 }
  
 
 
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
        for (var key in newTimes) {

          if(newTimes[key].date){
          newTimes[key].date = moment(newTimes[key].date.toDate()).format("MM/DD/YY");
        }
        }
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
          {
            title: "Date",
            field: "date",
            editComponent: ({ value, onRowDataChange, rowData}) => (
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Date picker inline"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </MuiPickersUtilsProvider>
            ),
          },
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
          tooltip: 'Manage Chemicals',
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