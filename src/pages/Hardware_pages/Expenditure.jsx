import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { gethardwarespending } from '../../services/allapi';

function Expenditure() {
  const [yearlyData, setYearlyData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);



  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real application, replace this with your API call
        // const response = await getHardwareData();
        const response= await gethardwarespending()
        console.log(response);
        
        
        if (response && typeof response === 'object') {
          setYearlyData(response);
          const years = Object.keys(response).sort();
          setAvailableYears(years);
          
          // Set default selected year to the most recent year
          if (years.length > 0 && !years.includes(selectedYear.toString())) {
            setSelectedYear(years[years.length - 1]);
          }
        } else {
          setError('Invalid data format received');
        }
      } catch (error) {
        console.error("Error fetching hardware expenditure data:", error);
        setError('Failed to fetch hardware expenditure data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Group hardware by type for better visualization
  const getHardwareByType = () => {
    if (!yearlyData || !yearlyData[selectedYear]) return {};
    
    const hardwareItems = yearlyData[selectedYear].hardware_cost_breakdown || [];
    return hardwareItems.reduce((grouped, item) => {
      if (!grouped[item.hardware_type]) {
        grouped[item.hardware_type] = {
          items: [],
          total_purchase: 0,
          total_maintenance: 0,
          total_cost: 0,
          count: 0
        };
      }
      
      grouped[item.hardware_type].items.push(item);
      grouped[item.hardware_type].total_purchase += Number(item.purchase_cost) || 0;
      grouped[item.hardware_type].total_maintenance += Number(item.maintenance_cost) || 0;
      grouped[item.hardware_type].total_cost += Number(item.total_cost) || 0;
      grouped[item.hardware_type].count += 1;
      
      return grouped;
    }, {});
  };

  const downloadPDF = () => {
    if (!yearlyData || !yearlyData[selectedYear]) return;
    
    const doc = new jsPDF();
    const data = yearlyData[selectedYear];
    
    // Add title
    doc.setFontSize(18);
    doc.text('HARDWARE EXPENDITURE REPORT', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    // Add company info
    doc.setFontSize(14);
    doc.text('Yearly Hardware Expenditure Statement', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Company Name: Rits Software`, doc.internal.pageSize.getWidth() / 2, 38, { align: 'center' });
    doc.text(`Year: ${selectedYear}`, doc.internal.pageSize.getWidth() / 2, 45, { align: 'center' });
    
    // Summary table
    const summaryHeaders = [['Description', 'Amount (INR)']];
    const summaryData = [
      ['Total Purchase Cost', data.total_purchase_cost],
      ['Total Maintenance Cost', data.total_maintenance_cost],
      ['Total Hardware Cost', data.total_hardware_cost]
    ];
    
    autoTable(doc, {
      head: summaryHeaders,
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [0, 32, 96], textColor: 255, fontStyle: 'bold' },
      bodyStyles: { textColor: 40 },
      startY: 55,
      margin: { left: 20, right: 20 }
    });
    
    // Detailed table
    const detailedHeaders = [['Hardware Type', 'Manufacturer', 'Model', 'Purchase', 'Maintenance', 'Total']];
    const detailedData = data.hardware_cost_breakdown.map(item => [
      item.hardware_type,
      item.manufacturer,
      item.model_number,
      item.purchase_cost,
      item.maintenance_cost,
      item.total_cost
    ]);
    
    autoTable(doc, {
      head: detailedHeaders,
      body: detailedData,
      theme: 'grid',
      headStyles: { fillColor: [0, 32, 96], textColor: 255, fontStyle: 'bold' },
      bodyStyles: { textColor: 40 },
      startY: doc.lastAutoTable.finalY + 15,
      margin: { left: 20, right: 20 },
      didDrawPage: function(data) {
        // Add a footer with page number
        doc.setFontSize(10);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          data.settings.margin.left,
          doc.internal.pageSize.getHeight() - 10
        );
        
        // Add timestamp
        const date = new Date().toLocaleString();
        doc.text(
          `Generated on: ${date}`,
          doc.internal.pageSize.getWidth() - data.settings.margin.right,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'right' }
        );
      }
    });
    
    // Save the PDF
    doc.save(`Hardware_Expenditure_Report_${selectedYear}.pdf`);
  };

  // Component for hardware type card (mobile and desktop)
  const HardwareTypeCard = ({ title, items, totalPurchase, totalMaintenance, totalCost, count }) => (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      <div className="bg-blue-950 text-white px-4 py-2 font-bold flex justify-between">
        <span>{title}</span>
        <span>{count} items</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-y-2">
          <div className="text-gray-600">Purchase Cost:</div>
          <div className="text-right font-medium">₹{totalPurchase.toLocaleString()}</div>
          
          <div className="text-gray-600">Maintenance Cost:</div>
          <div className="text-right font-medium">₹{totalMaintenance.toLocaleString()}</div>
          
          <div className="text-gray-700 font-semibold pt-2 border-t mt-2">Total Cost:</div>
          <div className="text-right font-bold pt-2 border-t mt-2">₹{totalCost.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );

  // Mobile summary card
  const MobileSummaryCard = ({ data }) => (
    <div className="bg-blue-50 rounded-lg shadow-md mb-4 p-4">
      <div className="font-bold text-lg mb-2 text-blue-900">YEARLY SUMMARY</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-sm text-gray-700">Purchase Cost:</div>
        <div className="text-right font-bold">₹{data.total_purchase_cost.toLocaleString()}</div>
        
        <div className="text-sm text-gray-700">Maintenance Cost:</div>
        <div className="text-right font-bold">₹{data.total_maintenance_cost.toLocaleString()}</div>
        
        <div className="text-sm font-bold text-gray-800 pt-2 border-t">Total Cost:</div>
        <div className="text-right font-bold pt-2 border-t text-blue-950">₹{data.total_hardware_cost.toLocaleString()}</div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading hardware expenditure data...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  // If no data available for selected year
  if (!yearlyData || !yearlyData[selectedYear]) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">HARDWARE EXPENDITURE ANALYSIS</h1>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-lg text-gray-700">No data available for the selected year.</p>
        </div>
      </div>
    );
  }

  const data = yearlyData[selectedYear];
  const hardwareByType = getHardwareByType();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">HARDWARE EXPENDITURE ANALYSIS</h1>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <label htmlFor="year-select" className="font-bold text-gray-700">Select Year:</label>
            <select 
              id="year-select" 
              value={selectedYear} 
              onChange={handleYearChange} 
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={downloadPDF}
          >
            Download PDF Report
          </button>
        </div>
        
        <div className="text-xl md:text-2xl text-center mb-6">
          <div className="md:mb-0 mb-2">Yearly Hardware Expenditure Statement</div>
          <div className="text-base md:text-lg font-medium">Company Name: Rits Software</div>
          <div className="text-sm md:text-base">Year: {selectedYear}</div>
        </div>
        
        {/* Summary Card - Shown on both mobile and desktop */}
        <div className="bg-white rounded-lg shadow-lg p-5 mb-8">
          <h2 className="text-xl font-bold text-blue-950 mb-4">Yearly Summary</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Purchase Cost</div>
              <div className="text-2xl font-bold text-blue-800">₹{data.total_purchase_cost.toLocaleString()}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Maintenance Cost</div>
              <div className="text-2xl font-bold text-blue-800">₹{data.total_maintenance_cost.toLocaleString()}</div>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Hardware Cost</div>
              <div className="text-2xl font-bold text-indigo-900">₹{data.total_hardware_cost.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        {/* Detailed breakdown section */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hardware Breakdown by Type</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(hardwareByType).map(type => (
            <HardwareTypeCard 
              key={type}
              title={type}
              items={hardwareByType[type].items}
              totalPurchase={hardwareByType[type].total_purchase}
              totalMaintenance={hardwareByType[type].total_maintenance}
              totalCost={hardwareByType[type].total_cost}
              count={hardwareByType[type].count}
            />
          ))}
        </div>
        
        {/* Detailed Item List - Only shown on desktop */}
        {!isMobile && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">Detailed Hardware List</h2>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-blue-950 text-white">
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Manufacturer</th>
                    <th className="px-4 py-2 text-left">Model</th>
                    <th className="px-4 py-2 text-left">Serial Number</th>
                    <th className="px-4 py-2 text-right">Purchase Cost</th>
                    <th className="px-4 py-2 text-right">Maintenance</th>
                    <th className="px-4 py-2 text-right">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {data.hardware_cost_breakdown.map((item, index) => (
                    <tr key={item.hardware_id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-4 py-2">{item.hardware_type}</td>
                      <td className="px-4 py-2">{item.manufacturer}</td>
                      <td className="px-4 py-2">{item.model_number}</td>
                      <td className="px-4 py-2 font-mono text-sm">{item.serial_number}</td>
                      <td className="px-4 py-2 text-right">₹{item.purchase_cost.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">₹{item.maintenance_cost.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right font-medium">₹{item.total_cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-200 font-bold">
                    <td className="px-4 py-2" colSpan="4">TOTAL</td>
                    <td className="px-4 py-2 text-right">₹{data.total_purchase_cost.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">₹{data.total_maintenance_cost.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">₹{data.total_hardware_cost.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Expenditure;