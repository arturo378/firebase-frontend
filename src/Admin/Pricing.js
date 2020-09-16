import React, { useState, useEffect } from 'react';
import MaterialTable, {MTableToolbar} from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import fire from '../config/fire';
import Button from '@material-ui/core/Button';
import { Select, MenuItem } from "@material-ui/core";





function Pricing(){
  const location = useLocation();
  const [data, setData] = useState([])
  const [companyid, setCompanyid]= useState('')
  const [chemicallist, setChemicalList] = useState([])
  


  const additem = (incoming, resolve) => {
     //validation
  let errorList = []
  if(incoming.name === undefined){
    errorList.push("Please enter first name")
  }
  if(incoming.price === undefined){
    errorList.push("Please enter last name")
  }
  
  if(errorList.length < 1){
    let dataToAdd =[];
    dataToAdd.push(incoming);
    console.log(dataToAdd[0].city)
          fire 
          .firestore()
          .collection('assets').add({
            "price": dataToAdd[0].price,
            "name": dataToAdd[0].name,
            company: companyid,
            type: "pricing"
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
if(incoming.price === undefined){
  errorList.push("Please enter last name")
}
if(errorList.length < 1){
 let dataToAdd =[];
 dataToAdd.push(incoming);
 console.log(dataToAdd[0].city)
       fire 
       .firestore()
       .collection('assets').doc(oldincoming.id).update({
        "price": dataToAdd[0].price,
        "name": dataToAdd[0].name,
        company: companyid,
        type: "pricing"
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
    
    const id = location.state.id
    setCompanyid(location.state.id)




    fire
    .firestore()
    .collection('assets').where('type', '==', 'pricing').where('company', '==', id)
    .onSnapshot((snapshot) => {
      const newTimes = snapshot.docs.map(((doc) => ({
        id: doc.id,
        ...doc.data()
      })))
      
      setData(newTimes)
    })

    fire
      .firestore()
      .collection('assets').where('type', '==', 'chemical')
      .onSnapshot((snapshot) => {
        const chemicals = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        
        setChemicalList(chemicals)
      })
    
  }, [])

 console.log(chemicallist)

    //console.log(data)
  
    const history = useHistory(); 
    function test(data, rowdata) {
      let id = rowdata;
      setCompanyid(rowdata.id)
      history.push({
        pathname: '/locationmanagment/leasemanagment',
        state: id
      });
      
    }
    function back() {
      history.push("/locationmanagment/");
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
                    country: ''
                  });
                }}
              >
                {data.map((chemical) => (
                  console.log(chemical),
                  <MenuItem key={chemical.id} value={chemical.tradename}>
                    {chemical.tradename}
                  </MenuItem>
                ))}
              </Select>
            ),
          },
          {title: "Price", field: "price"}
        ]
        
      });



    
    
    return (
      
      
      
      
        <MaterialTable
        
      title="Pricing"
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
      actions={[
        {
          icon: 'sort',
          tooltip: 'Save User',
          onClick: (event, rowData) => test(event, rowData)
            
        
        }]}
    />
    );
}

export default Pricing;