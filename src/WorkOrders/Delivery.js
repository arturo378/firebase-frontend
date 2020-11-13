import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from "react-router-dom";
import fire from '../config/fire';
import { Select, MenuItem } from "@material-ui/core";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment  from 'moment';






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

function Delivery(){
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false);
  // const [leaselist, setLeaseList] = useState([''])
  const CLW = getCLW();
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const GoogleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [position, setPosition] = useState({})
  var companyid = '';
  var leaseid = '';

  const [selectedDate, setSelectedDate] = useState(new Date());


  const handleDateChange = (date) => {
    console.log(date);
    setSelectedDate(date);
  };

  
  const handleClose = () => {
    setOpen(false);
  };
  

  const mapStyles = {        
    height: "400px",
    width: "100%"};


    const onLoad = marker => {
      console.log('marker: ', marker)
    }


  const additem = (incoming, resolve) => {

   
     //validation
  let errorList = []
  if(incoming.company.name === undefined){
    errorList.push("Please enter Company Name")
  }
  if(incoming.lease.name === undefined){
    errorList.push("Please enter a Lease Name")
  }
  if(incoming.well.name === undefined){
    errorList.push("Please enter a Well name")
  }
  if(incoming.gps === undefined){
    errorList.push("Please enter a gps coordinates")
  }
  if(incoming.comments === undefined){
    errorList.push("Please enter a comment")
  }
  if(incoming.createdBy === undefined){
    errorList.push("Please enter a user created name")
  }
  if(incoming.invoicenum === undefined){
    errorList.push("Please enter a invoice Num")
  }
  
  if(errorList.length < 1){
    let dataToAdd =[];
    
    dataToAdd.push(incoming);
    
    
          fire 
          .firestore()
          .collection('asset_data').add({
            "company": (dataToAdd[0].company).name,
            "companyid": (dataToAdd[0].company).id,
            "lease": (dataToAdd[0].lease).name,
            "well": (dataToAdd[0].well).name,
            "gps": dataToAdd[0].gps,
            "comments": dataToAdd[0].comments,
            "datanumber": "D-" + Math.round((new Date().getTime() / 1000)),
            "createdBy": dataToAdd[0].createdBy,
            "date": selectedDate,
            "invoicenum": dataToAdd[0].invoicenum,
            type: "delivery",
            active: 0
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
if(incoming.company.name === undefined){
    errorList.push("Please enter last 1")
  }
  if(incoming.lease.name === undefined){
    errorList.push("Please enter a valid 2")
  }
  if(incoming.well.name === undefined){
    errorList.push("Please enter a valid 3")
  }
  if(incoming.gps === undefined){
    errorList.push("Please enter a valid 4")
  }
  if(incoming.comments === undefined){
    errorList.push("Please enter a valid 5")
  }
  if(incoming.createdBy === undefined){
    errorList.push("Please enter a valid 6")
  }
 
 console.log(errorList);
if(errorList.length < 1){
 let dataToAdd =[];
 console.log(incoming)
 dataToAdd.push(incoming);

 
       fire 
       .firestore()
       .collection('asset_data').doc(oldincoming.id).update({
        "company": (dataToAdd[0].company).name,
        "companyid": (dataToAdd[0].company).id,
        "lease": dataToAdd[0].lease.name,
        "well": dataToAdd[0].well.name,
        "gps": dataToAdd[0].gps,
        "comments": dataToAdd[0].comments,
        "createdBy": dataToAdd[0].createdBy,
        "date": selectedDate,
        "invoicenum": dataToAdd[0].invoicenum,
        type: "delivery",
        active: dataToAdd[0].active
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
      .collection('asset_data').doc(incoming.id).delete()
      .then(function(){
        resolve()
        console.log("Document successfully written!");
      })
      .catch(function(error){
        resolve()
        console.error("Error writing document: ", error);
      });
};

  function getCLW(){
        
    var info = [];

    fire
    .firestore()
    .collection('assets').where('type', 'in', ['company', 'lease', 'well'])
    .onSnapshot((snapshot) => {
      const companies = snapshot.docs.map(((doc) => ({
        id: doc.id,
        ...doc.data()
      })))
      
      for (var key in companies) {
        info.push(companies[key]);
      }
    })

  return info;

  }

  const openmap = (event, rowData) => {
    var gpsdat = (rowData.gps).split(',');
  setPosition({
    lat: parseFloat(gpsdat[0]),
    lng: parseFloat(gpsdat[1])
  })
  
   
    
  
   if(position !== undefined){
    setOpen(true);
  
   }
    
   
   
  };

  

  useEffect(() => {
    
    fire
      .firestore()
      .collection('asset_data').where('type', '==', 'delivery')
      .onSnapshot((snapshot) => {
        var newTimes = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))

        
        for (var key in newTimes) {

          
          newTimes[key].date = moment(newTimes[key].date.toDate()).format("MM/DD/YY");
        }

        // newTimes.date = moment(newTimes.date).format("MM/DD/YY"); 
        // console.log(moment(newTimes[0].date.toDate()).format("MM/DD/YY"));return;
        setData(newTimes)
      })
      
      
  }, [])

    //console.log(data)
  
    const history = useHistory(); 
    function test(data, rowdata) {
      
      
      
      history.push({
        pathname: '/delivery/editdelivery',
        state: rowdata
        
      });
      
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
 
  
    const [state, setState] = React.useState({
        columns: [
          {title: "id", field: "id", hidden: true},
          {title: "Data Number", field: "datanumber", editable: 'never'},
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
         
          {
            title: "Company",
            field: "company",
            editComponent: ({ value, onRowDataChange, rowData}) => (
              <Select
              
                value={value}
                // onClose = {(event) => {
                //   handleClose(event);
                // }}
                onChange={(event) => {
                  event.preventDefault();
                  if(event.target.value.id){
                    companyid = event.target.value.id;
                    leaseid = '';
                  }
                  
                  onRowDataChange({
                    ...rowData,
                    company: (event.target.value)
                    
                  }); 
                }}
              >
                {CLW.filter(type => type.type === 'company').map((companyinfo) => (
                  
                  <MenuItem key={companyinfo.id} value={companyinfo}>
                    {companyinfo.name}
                  </MenuItem>
                ))}
              </Select>
            ),
          },
          {
            title: "Lease",
            field: "lease",
            editComponent: ({ value, onRowDataChange, rowData}) => (
              <Select
              
                value={value}
                
                onChange={(event) => {
                  if(event.target.value.id){
                    leaseid = event.target.value.id;
                  }
                  onRowDataChange({
                    ...rowData,
                    lease: (event.target.value)
                    
                  });
                }}
              >
                { CLW.filter(type => type.company === companyid).map((companyinfo) => (
                  
                  <MenuItem key={companyinfo.id} value={companyinfo}>
                    {companyinfo.name}
                  </MenuItem>
                ))}
              </Select>
            ),
          },
         
          {
            title: "Well",
            field: "well",
            editComponent: ({ value, onRowDataChange, rowData}) => (
              <Select
              
                value={value}
                
                onChange={(event) => {
                  onRowDataChange({
                    ...rowData,
                    well: (event.target.value)
                    
                  });
                }}
              >
                { CLW.filter(type => type.lease === leaseid).map((companyinfo) => (
                  
                  <MenuItem key={companyinfo.id} value={companyinfo}>
                    {companyinfo.name}
                  </MenuItem>
                ))}
              </Select>
            ),
          },
          {title: "GPS", field: "gps"},
          {title: "Comments", field: "comments"},
          {title: "Created By", field: "createdBy"},
          {title: "Invoice Number", field: "invoicenum"},
          {
            title: 'Completed',
            field: 'active',
            lookup: { 1: 'Completed', 0: 'Non-Completed' },
          }

        ]
        
      });


    return (
      <div>
        <MaterialTable
       onRowClick={openmap} 
      title="Delivery"
      columns={state.columns}
      data={data}
      options={{
        filtering: true
      }}
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

export default Delivery;