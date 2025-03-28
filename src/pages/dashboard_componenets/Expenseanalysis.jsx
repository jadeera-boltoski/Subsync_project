/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getexpenditure_data } from '../../services/allapi';


const Expenseanalysis = () => {
  const navigate=useNavigate()
  

  const[monthlyData,setmonthlyData]=useState([])


  // fetch data from backenend
  useEffect(()=>{
    const getdata=async()=>{
      try {
        const response = await getexpenditure_data();
        console.log("expenditure data",response);
        
        if (Array.isArray(response)) {
          setmonthlyData(response);
        } else {
          console.error("Unexpected API response format", response);
        }
      } catch (error) {
        console.error("Error fetching expenditure data:", error);
      }
      

    }
    getdata()
  },[])

  // Calculate yearly data from monthly data
  const calculateYearlyData = () => {
    const yearlyTotals = {};

    monthlyData.forEach(item => {
      const year = item.year;

      if (!yearlyTotals[year]) {
        yearlyTotals[year] = {
          year,
          Software: 0,
          Server: 0,
          Domain: 0,
          Utility: 0
        };
      }

      yearlyTotals[year].Software += item.Software;
      yearlyTotals[year].Server += item.Server;
      yearlyTotals[year].Domain += item.Domain;
      yearlyTotals[year].Utility += item.Utility;
    });

    return Object.values(yearlyTotals);
  };

  const yearlyData = calculateYearlyData();
  // State for the view type
  const [viewType, setViewType] = useState('monthly'); // 'monthly' or 'yearly'
  const [selectedYear, setSelectedYear] = useState('');
  useEffect(() => {
    if (monthlyData.length > 0) {
      const uniqueYears = [...new Set(monthlyData.map(item => item.year))].sort((a, b) => b - a);
      setSelectedYear(uniqueYears[0]?.toString() || '');
    }
  }, [monthlyData]); // Update when data is fetched
  

  // Filter data based on selected year if not 'all'
  const filteredMonthlyData = selectedYear === 'all'
    ? monthlyData
    : monthlyData.filter(item => item.year === parseInt(selectedYear));

  // Determine which data to display based on view type
  const displayData = viewType === 'monthly' ? filteredMonthlyData : yearlyData;

  // Get unique years from data for the filter
  const years = [...new Set(monthlyData.map(item => item.year))];

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Custom tooltip
   
  const CustomTooltip = ({ active, payload, label }) => {
     
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-3 rounded shadow-md">
          <p className="font-medium">{viewType === 'monthly' ? `${label} ${selectedYear !== 'all' ? selectedYear : ''}` : `Year ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          <p className="font-medium mt-1">
            Total: {formatCurrency(payload.reduce((sum, entry) => sum + entry.value, 0))}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-gray-200 text-white p-3 rounded-lg">
      <div className="mb-3 flex justify-between items-center">
        <h2 className="text-xl font-bold text-center w-full bg-blue-500 py-2 rounded">
          {viewType === 'monthly' ? 'Monthly Expenditures by Category' : 'Yearly Expenditures by Category'}
        </h2>
      </div>

      <div className="mb-2 flex justify-end space-x-4 ">
      <h6 className='font-bold text-blue-400 cursor-default mr-auto ml-2' onClick={() => navigate("/dashboard/expense_report")}>View Report</h6>
        <div>
          
          <label className="mr-2 text-xs">View:</label>
          <select
            className="bg-gray-700 text-white px-2 py-0.5 text-xs rounded border border-gray-600"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {viewType === 'monthly' && (
          <div>
            <label className="mr-2 text-xs">Year:</label>
            <select
              className="bg-gray-700 text-white px-2 py-0.5 text-xs rounded border border-gray-600"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {/* <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))} */}
              {years
                .sort((a, b) => b - a) // Sort years in descending order (largest first)
                .map(year => (
                  <option key={year} value={year}>{year}</option>
                ))
              }
            </select>
          </div>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey={viewType === 'monthly' ? 'month' : 'year'}
              tick={{ fill: '#fff' }}
            />
            <YAxis
              tickFormatter={tick => `₹${tick / 1000}K`}
              tick={{ fill: '#fff' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey="Software" name="Software" fill="#4299E1" /> {/* Blue */}
            <Bar dataKey="Server" name="Server" fill="#F56565" /> {/* Red */}
            <Bar dataKey="Domain" name="Domain" fill="#68D391" /> {/* Green */}
            <Bar dataKey="Utility" name="Utility" fill="#ED8936" /> {/* Orange */}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {['Software', 'Server', 'Domain', 'Utility'].map(category => {
          const total = displayData.reduce((sum, item) => sum + item[category], 0);
          const categoryColor = {
            Software: '#4299E1',
            Server: '#F56565',
            Domain: '#68D391',
            Utility: '#ED8936'
          };

          return (
            <div key={category} className="bg-gray-800 p-2 rounded">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: categoryColor[category] }}
                ></div>
                <span className="text-sm">{category}</span>
              </div>
              <div className="text-lg font-bold">{formatCurrency(total)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Expenseanalysis;