import React, { useState, useEffect } from 'react';
import MaterialTable, {MTableToolbar} from 'material-table';
import { useHistory, useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';
import fire from '../config/fire';









function LeaseManagement(){
  const location = useLocation();
  const [data, setData] = useState([])

  useEffect(() => {
    
    const id = location.state.rowdata.id
    
    
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
  console.log(data)

  const history = useHistory(); 
    function test(data, rowdata) {
      history.push("/locationmanagment/leasemanagment/wellmanagment");
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

export default LeaseManagement;