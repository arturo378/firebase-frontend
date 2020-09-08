import React from 'react';
import MaterialTable, {MTableToolbar}  from 'material-table';
import { useHistory } from "react-router-dom";

import Button from '@material-ui/core/Button';









function WellManagement(){
  const history = useHistory(); 
    function back() {
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
          { name: 'Mehmet', 
            surname: 'Baran', 
            birthYear: 1987, 
            birthCity: 63 },
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
        
      title="Well Management"
      columns={state.columns}
      data={state.data}
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
      
    />
    );
}

export default WellManagement;