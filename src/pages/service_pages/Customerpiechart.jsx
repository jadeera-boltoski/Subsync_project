// import React from 'react';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getcustomerpiechart } from '../../services/allapi';

const Customerpiechart = () => {
  // Sample data
  // const data = [
  //   { name: 'Inhouse', value: 35 },
  //   { name: 'External', value: 65 },
  // ];


  const[data,setdata]=useState([])
  useEffect(()=>{
    const getdata=async()=>{
      const response=await getcustomerpiechart()
      console.log(response);
      setdata(response)
      
    }
    getdata()
  },[])

  const COLORS = ['#101828', '#FF6900'];

  // Label inside pie slices with name and percentage
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        fontWeight="bold" 
        fontSize="12" 
        textAnchor="middle" 
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-65 flex items-start justify-center">
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="40%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={renderLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Customerpiechart;