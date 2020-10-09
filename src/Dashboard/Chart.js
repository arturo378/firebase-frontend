import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { BarChart, Tooltip, Bar, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import fire from '../config/fire';
import moment  from 'moment';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}


export default function Chart() {
  const theme = useTheme();
  const [data, setData] = useState([])




  useEffect(() => {

   var data = [{}];
    
 
    fire
    .firestore()
    .collection('asset_data').where('type', '==', 'delivery')
    .onSnapshot((snapshot) => {
      const deliveries = snapshot.docs.map(((doc) => ({
        id: doc.id,
        ...doc.data()
      })))

      fire
    .firestore()
    .collection('asset_data').where('type', '==', 'delivery_chemical')
    .onSnapshot((snapshot) => {
      const chem_data = snapshot.docs.map(((doc) => ({
        id: doc.id,
        ...doc.data()
      })))
     
      for (const [index, value] of deliveries.entries()) {
        var total = 0;

        for (const [index2, value2] of chem_data.entries()) {
          
          if(value.id == value2.deliveryid){
            
            total =+value2.quantity
            
          }


          
        }
        console.log(total)
      deliveries[index].total= total
      }
      

      var startdate = moment();
    startdate = startdate.subtract(7, "days");
    
    for (var i=0; i < 7; i++) {
      var total = 0;
      startdate = startdate.add(1, "days");
      for (const [index, value] of deliveries.entries()) {
        
        
          if(startdate.format("MM/DD/YYYY") == moment(value.date.toDate()).format("MM/DD/YYYY")){
            total =+value.total
          } 
        
      }
      data[i] = createData(startdate.format("MM/DD/YYYY"), total);

  } setData(data)
      
    })
      
      
    }) 

    

    console.log(data)

    
    
  }, [])

  return (
    <React.Fragment>
      <Title>Weekly Delivery Count</Title>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Deliveries (Gallons)
            </Label>
          </YAxis>
          <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
          <Bar dataKey="amount" fill="#8884d8" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}