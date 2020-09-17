import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import fire from '../config/fire';






function ShippingPaper(){
  const [data, setData] = useState([])
  const [companyID, setCompanyID] = useState([])


  const additem = (incoming, resolve) => {
      
     //validation
  let errorList = []
  if(incoming.name === undefined){
    errorList.push("Please enter first name")
  }
  if(incoming.warehousenumber === undefined){
    errorList.push("Please enter last name")
  }
  if(incoming.areamanager === undefined){
    errorList.push("Please enter a valid email")
  }
  if(errorList.length < 1){
    let dataToAdd =[];
    dataToAdd.push(incoming);
    console.log(dataToAdd);
    
          fire 
          .firestore()
          .collection('assets').add({
            "warehousenumber": dataToAdd[0].warehousenumber,
            "name": dataToAdd[0].name,
            "areamanager": dataToAdd[0].areamanager,
            type: "warehouse"
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
if(incoming.name === undefined){
 errorList.push("Please enter first name")
}
if(incoming.city === undefined){
 errorList.push("Please enter last name")
}
if(incoming.state === undefined){
 errorList.push("Please enter a valid email")
}
if(errorList.length < 1){
 let dataToAdd =[];
 dataToAdd.push(incoming);
 console.log(dataToAdd[0].city)
       fire 
       .firestore()
       .collection('assets').doc(oldincoming.id).update({
        "warehousenumber": dataToAdd[0].warehousenumber,
        "name": dataToAdd[0].name,
        "areamanager": dataToAdd[0].areamanager,
         type: "warehouse"
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
        pathname: '/locationmanagment/leasemanagment',
        state: id
      });
      
    }
 
  
    const [state, setState] = React.useState({
        columns: [
          {title: "id", field: "id", hidden: true},
          {title: "Created By", field: "createdby"},
          {title: "Origin Warehouse Number", field: "originwarehousenumber"},
          {title: "Destination Number", field: "destinationwarehousenumber"},
          {title: "Truck Number", field: "trucknumber"},
          {title: "Comments", field: "comments"},
          {title: "Location", field: "gps"}
        ]
        
      });



    
    
    return (
      
      
      
      
        <MaterialTable
        
      title="Warehouses"
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
          icon: 'sort',
          tooltip: 'Save User',
          onClick: (event, rowData) => test(event, rowData)
            
        
        }]}
    />
    );
}

export default ShippingPaper;