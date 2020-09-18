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
 console.log(dataToAdd[0].city)
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
      
      
      
      
        <MaterialTable
        
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
    );
}

export default ShippingPaper;