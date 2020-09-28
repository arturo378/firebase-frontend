import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import fire from '../config/fire';
import { Select, MenuItem } from "@material-ui/core";






function Delivery(){
  const [data, setData] = useState([])
  
  // const [leaselist, setLeaseList] = useState([''])
  const CLW = getCLW();

  var companyid = '';
  var leaseid = '';

  
  
  


  const additem = (incoming, resolve) => {

   
     //validation
  let errorList = []
  if(incoming.company.name === undefined){
    errorList.push("Please enter last name")
  }
  if(incoming.lease.name === undefined){
    errorList.push("Please enter a valid lease")
  }
  if(incoming.well.name === undefined){
    errorList.push("Please enter a valid well")
  }
  if(incoming.gps === undefined){
    errorList.push("Please enter a valid gps")
  }
  if(incoming.comments === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.createdBy === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.date === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.invoicenum === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.warehouse === undefined){
    errorList.push("Please enter a valid email")
  }
  
  if(errorList.length < 1){
    let dataToAdd =[];
    
    dataToAdd.push(incoming);
    
    
          fire 
          .firestore()
          .collection('asset_data').add({
            "company": (dataToAdd[0].company).name,
            "lease": (dataToAdd[0].lease).name,
            "well": (dataToAdd[0].well).name,
            "gps": dataToAdd[0].gps,
            "comments": dataToAdd[0].comments,
            "datanumber": dataToAdd[0].datanumber,
            "createdBy": dataToAdd[0].createdBy,
            "date": dataToAdd[0].date,
            "invoicenum": dataToAdd[0].invoicenum,
            "warehouse": dataToAdd[0].warehouse,
            type: "delivery"
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
    errorList.push("Please enter last name")
  }
  if(incoming.lease.name === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.well.name === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.gps === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.comments === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.createdBy === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.date === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.invoicenum === undefined){
    errorList.push("Please enter a valid email")
  }
  if(incoming.warehouse === undefined){
    errorList.push("Please enter a valid email")
  }
if(errorList.length < 1){
 let dataToAdd =[];
 dataToAdd.push(incoming);
 
       fire 
       .firestore()
       .collection('asset_data').doc(oldincoming.id).update({
        "company": (dataToAdd[0].company).name,
        "lease": dataToAdd[0].lease.name,
        "well": dataToAdd[0].well.name,
        "gps": dataToAdd[0].gps,
        "comments": dataToAdd[0].comments,
        "datanumber": dataToAdd[0].datanumber,
        "createdBy": dataToAdd[0].createdBy,
        "date": dataToAdd[0].date,
        "invoicenum": dataToAdd[0].invoicenum,
        "warehouse": dataToAdd[0].warehouse,
        type: "delivery"
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

  

  useEffect(() => {
    
    fire
      .firestore()
      .collection('asset_data').where('type', '==', 'delivery')
      .onSnapshot((snapshot) => {
        const newTimes = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        console.log(newTimes)
        setData(newTimes)
      })
      
      
  }, [])

    //console.log(data)
  
    const history = useHistory(); 
    function test(data, rowdata) {
      
      let id = rowdata.id;
      
      history.push({
        pathname: '/delivery/editdelivery',
        state: rowdata
        
      });
      
    }
 
  
    const [state, setState] = React.useState({
        columns: [
          {title: "id", field: "id", hidden: true},
          {title: "Data Number", field: "datanumber"},
         
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
                {CLW.filter(type => type.type == 'company').map((companyinfo) => (
                  
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
                { CLW.filter(type => type.company == companyid).map((companyinfo) => (
                  
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
                { CLW.filter(type => type.lease == leaseid).map((companyinfo) => (
                  
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
          {title: "Date", field: "date"},
          {title: "Invoice Number", field: "invoicenum"},
          {title: "Warehouse", field: "warehouse"},

        ]
        
      });


    return (

        <MaterialTable
        
      title="Delivery"
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
          tooltip: 'Manage Chemicals',
          onClick: (event, rowData) => test(event, rowData)
      
        }]}
    />
    );
}

export default Delivery;