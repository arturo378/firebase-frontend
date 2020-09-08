import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useHistory } from "react-router-dom";



function loadinfo(){
  const [data, setData] = useState([])

  useEffect(() => {
    fire
      .firestore()
      .collection('users').where('status', '==', '1')
      .onSnapshot((snapshot) => {
        const newTimes = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        setData(newTimes)
      })
  }, [])

  return data;

}



function LocationManagement(){
  const times = loadinfo();
    const history = useHistory(); 
    function test(data, rowdata) {
      history.push("/locationmanagment/leasemanagment");
    }
 
  
    const [state, setState] = React.useState({
        columns: [
          { title: 'Name', field: 'name' },
          { title: 'Surname', field: 'surname' },
          { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
          {
            title: 'Birth Place',
            field: 'birthCity',
            lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
          },
        ],
        data: [
          { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
          {
            name: 'Zerya Betül',
            surname: 'Baran',
            birthYear: 2017,
            birthCity: 34,
          },
        ],
      });



    
    
    return (
      
      
      
      
        <MaterialTable
        
      title="Company Management"
      columns={state.columns}
      data={state.data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
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