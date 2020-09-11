import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from "react-router-dom";
import fire from '../config/fire';






function LocationManagement(){
  const [data, setData] = useState([])
  const [companyID, setCompanyID] = useState([])


  const additem = (incoming, resolve) => {
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
          .collection('assets').add({
            "city": dataToAdd[0].city,
            "name": dataToAdd[0].name,
            "phone": dataToAdd[0].phone,
            "state": dataToAdd[0].state,
            "zip": dataToAdd[0].zip,
            type: "company"
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
         "city": dataToAdd[0].city,
         "name": dataToAdd[0].name,
         "phone": dataToAdd[0].phone,
         "state": dataToAdd[0].state,
         "zip": dataToAdd[0].zip,
         type: "company"
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
      .collection('assets').where('type', '==', 'company')
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
      setCompanyID(rowdata.id)
      history.push({
        pathname: '/locationmanagment/leasemanagment',
        state: { rowdata }
      });
      
    }
 
  
    const [state, setState] = React.useState({
        columns: [
          {title: "id", field: "id", hidden: true},
          {title: "Name", field: "name"},
          {title: "City", field: "city"},
          {title: "State", field: "state"},
          {title: "Zip Code", field: "zip"},
          {title: "Phone Number", field: "phone"}
        ]
        
      });



    
    
    return (
      
      
      
      
        <MaterialTable
        
      title="Company Management"
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

export default LocationManagement;