import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import fire from '../config/fire';






function WarehouseManagement(){
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
      .collection('assets').where('type', '==', 'warehouse')
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
        pathname: '/warehousechemical',
        state: id
      });
      
    }
 
  
    const [state, setState] = React.useState({
        columns: [
          {title: "id", field: "id", hidden: true},
          {title: "Warehouse Number", field: "warehousenumber"},
          {title: "Name", field: "name"},
          {title: "Area Manager", field: "areamanager"}
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
          icon: 'science',
          tooltip: 'Manage Inventory',
          onClick: (event, rowData) => test(event, rowData)
        }]}
    />
    );
}

export default WarehouseManagement;