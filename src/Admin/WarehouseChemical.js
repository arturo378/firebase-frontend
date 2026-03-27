import React, { useState, useEffect } from 'react';
import MaterialTable, {MTableToolbar}  from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import { Select, MenuItem } from "@material-ui/core";
import Button from '@material-ui/core/Button';
// import fire from '../config/fire';


function WarehouseChemical(props){
  const location = useLocation();
  const [data, setData] = useState([])
  const list = getChemicals();

 
  
  function getChemicals(){
    var info = [];
    // fire
    // .firestore()
    // .collection('assets').where('type', '==', 'chemical')
    // .onSnapshot((snapshot) => {
    //   const chemicals = snapshot.docs.map(((doc) => ({
    //     id: doc.id,
    //     ...doc.data()
    //   })))
      
    //    info.push(chemicals)
    // })
  return info;
}

  useEffect(() => {
    const id = location.state.id
 


    // fire
    //   .firestore()
    //   .collection('asset_data').where('type', '==', 'warehouse_chemical').where('warehouseid', '==', id)
    //   .onSnapshot((snapshot) => {
    //     const newTimes = snapshot.docs.map(((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
          
    //     })))
    //     setData(newTimes)
    //   })
  }, [])
    //setData(newTimes)
    
    
    
 

  const additem = (incoming, resolve) => {
    //validation
 let errorList = []
 if(incoming.name === undefined){
   errorList.push("Please enter first name")
 }
 if(errorList.length < 1){
   let dataToAdd =[];
   dataToAdd.push(incoming);
   console.log(location.state.id)
        //  fire 
        //  .firestore()
        //  .collection('asset_data').add({
           
        //    "name": dataToAdd[0].name,
        //    "quantity": dataToAdd[0].quantity,
        //   "warehouseid": location.state.id,
        //   "type": "warehouse_chemical"
           
           
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
      // .collection('asset_data').doc(oldincoming.id).update({
       
      //   "name": dataToAdd[0].name,
      //      "quantity": dataToAdd[0].quantity,
      //      "warehouseid": location.state.id,
      //      "type": "warehouse_chemical"
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
//      .collection('asset_data').doc(incoming.id).delete()
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
      
      
      history.push({
        pathname: '/warehousemanagement'
       
      });
    }

    const [state, setState] = React.useState({
      columns: [
        {title: "id", field: "id", hidden: true},
        {
          title: "Name",
          field: "name",
          editComponent: ({ value, onRowDataChange, rowData }) => (
            <Select
              value={value}
              onChange={(event) => {
                onRowDataChange({
                  ...rowData,
                  name: (event.target.value)
                  
                });
              }}
            >
              {list[0].map((chemical) => (
                
                <MenuItem key={chemical.id} value={chemical.tradename}>
                  {chemical.tradename}
                </MenuItem>
              ))}
            </Select>
          ),
        },
        {title: "Quantity", field: "quantity"}
        
      ],
        
      });



    
    
    return (
      
      
      
      
        <MaterialTable
        
      title="Warehouse Inventory"
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

export default WarehouseChemical;