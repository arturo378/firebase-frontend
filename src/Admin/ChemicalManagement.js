import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from "react-router-dom";
// import fire from '../config/fire';






function ChemicalManagement(){
  const [data, setData] = useState([])
  const [companyID, setCompanyID] = useState([])


  const additem = (incoming, resolve) => {
      
     //validation
  let errorList = []
  if(incoming.tradename === undefined){
    errorList.push("Please enter first name")
  }
  if(incoming.dottag === undefined){
    errorList.push("Please enter last name")
  }
  if(incoming.weight === undefined){
    errorList.push("Please enter a valid email")
  }
  if(errorList.length < 1){
    let dataToAdd =[];
    dataToAdd.push(incoming);
    console.log(dataToAdd);
    
          // fire 
          // .firestore()
          // .collection('assets').add({
          //   "tradename": dataToAdd[0].tradename,
          //   "dottag": dataToAdd[0].dottag,
          //   "weight": dataToAdd[0].weight,
          //   type: "chemical"
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
const updateitem = (oldincoming, incoming, resolve) => {
 
  //validation
let errorList = []
if(incoming.tradename === undefined){
    errorList.push("Please enter first name")
  }
  if(incoming.dottag === undefined){
    errorList.push("Please enter last name")
  }
  if(incoming.weight === undefined){
    errorList.push("Please enter a valid email")
  }
if(errorList.length < 1){
 let dataToAdd =[];
 dataToAdd.push(incoming);
 console.log(dataToAdd[0].city)
      //  fire 
      //  .firestore()
      //  .collection('assets').doc(oldincoming.id).update({
      //       "tradename": dataToAdd[0].tradename,
      //       "dottag": dataToAdd[0].dottag,
      //       "weight": dataToAdd[0].weight,
      //       type: "chemical"
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


const removeitem = (incoming, resolve) => {
  

  // fire 
  //     .firestore()
  //     .collection('assets').doc(incoming.id).delete()
  //     .then(function(){
  //       resolve()
  //       console.log("Document successfully written!");
  //     })
  //     .catch(function(error){
  //       resolve()
  //       console.error("Error writing document: ", error);
  //     });
  

};

  useEffect(() => {
    // fire
    //   .firestore()
    //   .collection('assets').where('type', '==', 'chemical')
    //   .onSnapshot((snapshot) => {
    //     const newTimes = snapshot.docs.map(((doc) => ({
    //       id: doc.id,
    //       ...doc.data()
    //     })))
    //     setData(newTimes)
    //   })
  }, [])

    //console.log(data)
  
    const [state, setState] = React.useState({
        columns: [
          {title: "id", field: "id", hidden: true},
          {title: "Trade Name", field: "tradename"},
          {title: "DOT Tag", field: "dottag"},
          {title: "Weight", field: "weight"}
        ]
        
      });



    
    
    return (
      
      
      
      
        <MaterialTable
        
      title="Product Management"
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
  
    />
    );
}

export default ChemicalManagement;