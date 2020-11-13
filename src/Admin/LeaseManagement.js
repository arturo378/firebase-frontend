import React, { useState, useEffect } from 'react';
import MaterialTable, {MTableToolbar} from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';
import fire from '../config/fire';









function LeaseManagement(){
  const location = useLocation();
  const [data, setData] = useState([])
  const [chemicallist, setChemicalList] = useState([])
  const [companyid, setCompanyid]= useState('')
  const [leaseID, setLeaseID] = useState([])

  useEffect(() => {
    const id = location.state.id
    setCompanyid(location.state.id)
    
    
    
    fire
      .firestore()
      .collection('assets').where('type', '==', 'lease').where('company', '==', id)
      .onSnapshot((snapshot) => {
        const newTimes = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        
        setData(newTimes)
      })


      
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
   
         fire 
         .firestore()
         .collection('assets').add({
           
           "name": dataToAdd[0].name,
           
           type: "lease",
           company: companyid
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


if(errorList.length < 1){
let dataToAdd =[];
dataToAdd.push(incoming);

      fire 
      .firestore()
      .collection('assets').doc(oldincoming.id).update({
       
        "name": dataToAdd[0].name,
        company: companyid,
        type: "lease"
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




  

  const history = useHistory(); 
    function test(data, rowdata) {
      let leaseid = rowdata.id
      setLeaseID(rowdata.id)
      history.push({
        pathname: '/locationmanagment/leasemanagment/wellmanagment',
        state: { leaseid, companyid }
        
      });
      
    }
    function back() {
      history.push("/locationmanagment/");
    }

    const [state, setState] = React.useState({
        columns: [
          {title: "id", field: "id", hidden: true},
          {title: "Name", field: "name"},
          
        ],
        
      });



    
    
    return (
      
      
      
      
        <MaterialTable
        
      title="Lease Management"
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
          tooltip: 'Manage Well',
          onClick: (event, rowData) => test(event, rowData)
        }]}
    />
    );
}

export default LeaseManagement;