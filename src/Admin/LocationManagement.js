import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from "react-router-dom";
import fire from '../config/fire';






function LocationManagement(){
  const [data, setData] = useState([])
  const [city, setCity] = useState('')
  const [county, setCounty] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  

  const item = (incoming, resolve) => {

    console.log(incoming.name)
    
      setCity(incoming.city)
      setCounty(incoming.county)
      setName(incoming.name)
      setPhone(incoming.setPHone)
      
      if(city){
        resolve()
        
      }
      
      
     
    
    
     return;
    fire 
          .firestore()
          .collection('assets').add({
            city: incoming.city,
            county: incoming.county,
            name: incoming.name,
            phone: incoming.phone,
            type: "company"
          })
          .then(function(){
            resolve()
            console.log("Document successfully written!");
          })
          .catch(function(error){
            console.error("Error writing document: ", error);
          })



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
      history.push("/locationmanagment/leasemanagment");
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
         
          
        item(newData,resolve);
    }),
        
          
            
            // setNewdata((newData) => {
            //   fire 
            // .firestore()
            // .collection('assets').add({
            //   city: newitem.city,
            //   county: newitem.county,
            //   name: newitem.name,
            //   phone: newitem.phone,
            //   type: "company"
            // })
            // .then(function(){
            //   console.log("Document successfully written!");
            // })
            // .catch(function(error){
            //   console.error("Error writing document: ", error);
            // })
              
            // }),
        

          
        
      
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
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