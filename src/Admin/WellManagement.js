import React, { useState, useEffect } from 'react';
import MaterialTable, {MTableToolbar}  from 'material-table';
import { useHistory, useLocation } from "react-router-dom";

import Button from '@material-ui/core/Button';
// import fire from '../config/fire';









function WellManagement(props){
  const location = useLocation();
  const [data, setData] = useState([])
  const [leaseid, setLeaseid]= useState('')
  const [companyid, seCompanyid]= useState('')



  useEffect(() => {
    const id = location.state.leaseid
    setLeaseid(location.state.leaseid)
    seCompanyid(location.state.companyid)
    
    
    
    // fire
    //   .firestore()
    //   .collection('assets').where('type', '==', 'well').where('lease', '==', id)
    //   .onSnapshot((snapshot) => {
    //     const newTimes = snapshot.docs.map(((doc) => ({
    //       id: doc.id,
    //       ...doc.data()
    //     })))
        
    //     setData(newTimes)
    //   })
    
  }, [])

  const additem = (incoming, resolve) => {
    //validation
 let errorList = []
 if(incoming.name === undefined){
   errorList.push("Please enter first name")
 }
 if(errorList.length < 1){
   let dataToAdd =[];
   dataToAdd.push(incoming);
   
        //  fire 
        //  .firestore()
        //  .collection('assets').add({
           
        //    "name": dataToAdd[0].name,
        //    "gps": dataToAdd[0].gps,
        //   "description": dataToAdd[0].description,
        //    type: "well",
        //    lease: leaseid
        //  })
        //  .then(function(){
        //    resolve()
        //    console.log("Document successfully written!");
        //  })
        //  .catch(function(error){
        //    console.error("Error writing document: ", error);
        //    resolve()
        //  })
 }
};
const updateitem = (oldincoming, incoming, resolve) => {

 //validation
let errorList = []
if(incoming.name === undefined){
errorList.push("Please enter first name")
}


if(errorList.length < 1){
let dataToAdd =[];
dataToAdd.push(incoming);

      // fire 
      // .firestore()
      // .collection('assets').doc(oldincoming.id).update({
       
      //   "name": dataToAdd[0].name,
      //   "gps": dataToAdd[0].gps,
      //   "description": dataToAdd[0].description,
      //   lease: leaseid,
      //   type: "well"
      // })
      // .then(function(){
      //   resolve()
      //   console.log("Document successfully written!");
      // })
      // .catch(function(error){
      //   console.error("Error writing document: ", error);
      //   resolve()
      // })
}
};


const removeitem = (incoming, resolve) => {
 

//  fire 
//      .firestore()
//      .collection('assets').doc(incoming.id).delete()
//      .then(function(){
//        resolve()
//        console.log("Document successfully written!");
//      })
//      .catch(function(error){
//        resolve()
//        console.error("Error writing document: ", error);
//      });
 

};
  


  const history = useHistory(); 
    function back() {
      let rowdata = {'id': companyid}
      
      history.push({
        pathname: '/locationmanagment/leasemanagment',
        state: rowdata
       
      });
    }

    const [state, setState] = React.useState({
      columns: [
        {title: "id", field: "id", hidden: true},
        {title: "Name", field: "name"},
        {title: "GPS Coordinates", field: "gps"},
        {title: "Description", field: "description"},
        
      ],
        
      });



    
    
    return (
      
      
      
      
        <MaterialTable
        
      title="Well Management"
      columns={state.columns}
      data={data}
      components={{
        Toolbar: props => (
          <div>
            <MTableToolbar {...props} />
            <div style={{padding: '0px 10px'}}>
            <Button variant="contained" onClick= {back}>Back</Button>
              
            </div>
          </div>
        ),
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
      
    />
    );
}

export default WellManagement;