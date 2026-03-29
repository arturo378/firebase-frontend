import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { BarChart, Tooltip, Bar, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import { subDays, format } from 'date-fns';
import api from '../config/api';

function createData(time, amount) {
  return { time, amount };
}

export default function Chart() {
  const theme = useTheme();
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/api/deliveries').then((deliveries) => {
      const today = new Date();
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const day = subDays(today, i);
        const dayStr = format(day, 'MM/dd/yyyy');
        const count = deliveries.filter(d => {
          if (!d.date) return false;
          return format(new Date(d.date), 'MM/dd/yyyy') === dayStr;
        }).length;
        chartData.push(createData(dayStr, count));
      }
      setData(chartData);
    }).catch(console.error);
  }, []);

  return (
    <React.Fragment>
      <Title>Weekly Delivery Count</Title>
      <ResponsiveContainer width="100%" height={300}>
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
              Deliveries (Count)
            </Label>
          </YAxis>
          <Tooltip
            wrapperStyle={{ borderRadius: 8 }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
            }}
            labelStyle={{ color: '#334155' }}
          />
          <Bar dataKey="amount" fill="#1e40af" barSize={28} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
