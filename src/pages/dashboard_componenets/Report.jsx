/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { getreport } from '../../services/allapi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Report = () => {
  const [selectedYear, setSelectedYear] = useState();
  const [monthlyData, setMonthlyData] = useState([]);
  const [totals, setTotals] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getreport();
        console.log("Report data:", response);
        
        if (response && typeof response === 'object') {
          setdataByYear(response);
          // Extract available years from the response
          const years = Object.keys(response).filter(key => 
            Array.isArray(response[key]) && response[key].length > 0
          );
          setAvailableYears(years);
          
          // Set default selected year to the most recent available year
          if (years.length > 0 && !years.includes(selectedYear)) {
            setSelectedYear(years[years.length - 1]);
          }
        } else {
          setError('Invalid data format received from the server');
        }
      } catch (error) {
        console.error("Error fetching expenditure data:", error);
        setError('Failed to fetch expenditure data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const [dataByYear, setdataByYear] = useState(null);
  
  // Calculate totals for a given dataset
  const calculateTotals = (data) => {
    return {
      software: data.reduce((sum, item) => sum + (Number(item.software) || 0), 0),
      domain: data.reduce((sum, item) => sum + (Number(item.domain) || 0), 0),
      server: data.reduce((sum, item) => sum + (Number(item.server) || 0), 0),
      utility: data.reduce((sum, item) => sum + (Number(item.utility) || 0), 0),
      total: data.reduce((sum, item) => sum + (Number(item.total) || 0), 0),
    };
  };
  
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
  
  // Update data when year changes or when dataByYear is updated
  useEffect(() => {
    if (dataByYear && dataByYear[selectedYear]) {
      const data = dataByYear[selectedYear] || [];
      setMonthlyData(data);
      setTotals(calculateTotals(data));
    } else {
      setMonthlyData([]);
      setTotals({
        software: 0,
        domain: 0,
        server: 0,
        utility: 0,
        total: 0
      });
    }
  }, [selectedYear, dataByYear]);
  
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };
  
  const downloadPDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('EXPENDITURE YEARLY REPORT', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    // Add company info
    doc.setFontSize(14);
    doc.text('Yearly Subscription Statement', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Company Name: Rits Software`, doc.internal.pageSize.getWidth() / 2, 38, { align: 'center' });
    doc.text(`Year: ${selectedYear}`, doc.internal.pageSize.getWidth() / 2, 45, { align: 'center' });
    
    // Add the data as a table
    if (monthlyData.length > 0) {
      // Prepare the data for the table
      const tableData = monthlyData.map(item => [
        item.month,
        item.software,
        item.domain,
        item.server,
        item.utility,
        item.total
      ]);
      
      // Define table headers
      const headers = [['Month', 'Software', 'Domain', 'Server', 'Utility Bills', 'Total']];
      
      // Use autoTable directly instead of as a method of doc
      autoTable(doc, {
        head: headers,
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [0, 32, 96], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { textColor: 40 },
        
        margin: { top: 55 },
        foot: [['TOTAL', totals.software, totals.domain, totals.server, totals.utility, totals.total]],
        footStyles: { fillColor: [220, 220, 220], textColor: 40, fontStyle: 'bold' },
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
      
      // // Add note at the bottom
      // doc.setFontSize(10);
      // doc.text(
      //   'This is an automatically generated report. All amounts are in INR.',
      //   doc.internal.pageSize.getWidth() / 2, 
      //   doc.internal.pageSize.getHeight() - 20,
      //   { align: 'center' }
      // );
    } else {
      // No data message
      doc.setFontSize(12);
      doc.text('No data available for the selected year.', doc.internal.pageSize.getWidth() / 2, 70, { align: 'center' });
    }
    
    // Save the PDF
    doc.save(`Expenditure_Report_${selectedYear}.pdf`);
  };
  
  // Mobile card view for each month's data
   
  const MobileCard = ({ data }) => (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      <div className="font-bold text-lg mb-2 text-blue-900">{data.month}</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-sm text-gray-600">Software:</div>
        <div className="text-right font-medium">{data.software}</div>
        
        <div className="text-sm text-gray-600">Domain:</div>
        <div className="text-right font-medium">{data.domain}</div>
        
        <div className="text-sm text-gray-600">Server:</div>
        <div className="text-right font-medium">{data.server}</div>
        
        <div className="text-sm text-gray-600">Utility Bills:</div>
        <div className="text-right font-medium">{data.utility}</div>
        
        <div className="text-sm font-bold text-gray-700 pt-2 border-t">Total:</div>
        <div className="text-right font-bold pt-2 border-t">{data.total}</div>
      </div>
    </div>
  );

  // Mobile totals card
  const MobileTotalsCard = ({ totals }) => (
    <div className="bg-gray-200 rounded-lg shadow mb-4 p-4">
      <div className="font-bold text-lg mb-2 text-blue-900">YEARLY TOTALS</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-sm text-gray-700">Software:</div>
        <div className="text-right font-bold">{totals.software}</div>
        
        <div className="text-sm text-gray-700">Domain:</div>
        <div className="text-right font-bold">{totals.domain}</div>
        
        <div className="text-sm text-gray-700">Server:</div>
        <div className="text-right font-bold">{totals.server}</div>
        
        <div className="text-sm text-gray-700">Utility Bills:</div>
        <div className="text-right font-bold">{totals.utility}</div>
        
        <div className="text-sm font-bold text-gray-800 pt-2 border-t">Total:</div>
        <div className="text-right font-bold pt-2 border-t">{totals.total}</div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading expenditure data...</div>
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

  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-6">EXPENDITURE YEARLY REPORT</h1>
        
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
          
          <div className="flex space-x-3">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={downloadPDF}
            >
              Download PDF
            </button>
          </div>
        </div>
        
        <div className="text-xl md:text-2xl text-center mb-6">
          <div className="md:mb-0 mb-2">Yearly Subscription Statement</div>
          <div className="text-base md:text-lg font-medium">Company Name: Rits Software</div>
          <div className="text-sm md:text-base">Year: {selectedYear}</div>
        </div>
        
        {monthlyData.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-lg text-gray-700">No data available for the selected year.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            {!isMobile && (
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-blue-950 text-white">
                      <th colSpan={1} className="px-4 py-2 text-left border">Company Name: Rits Software</th>
                      <th colSpan={1} className="px-4 py-2 text-left border">Unit: Currency (INR)</th>
                      <th colSpan={2} className="px-4 py-2 text-right border">Year:</th>
                      <th colSpan={2} className="px-4 py-2 text-center border">{selectedYear}</th>
                    </tr>
                    <tr className="bg-blue-950 text-white">
                      <th rowSpan={2} className="px-4 py-2 border">Date</th>
                      <th colSpan={4} className="px-4 py-2 text-center border">Subscription Categories</th>
                      <th className="px-4 py-2 border" rowSpan={2}>Total</th>
                    </tr>
                    <tr className="bg-blue-950 text-white">
                      <th className="px-4 py-2 border">Software</th>
                      <th className="px-4 py-2 border">Domain</th>
                      <th className="px-4 py-2 border">Server</th>
                      <th className="px-4 py-2 border">Utility Bills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((data, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                        <td className="px-4 py-2 border font-medium">{data.month}</td>
                        <td className="px-4 py-2 border text-right">{data.software}</td>
                        <td className="px-4 py-2 border text-right">{data.domain}</td>
                        <td className="px-4 py-2 border text-right">{data.server}</td>
                        <td className="px-4 py-2 border text-right">{data.utility}</td>
                        <td className="px-4 py-2 border text-right">{data.total}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-200 font-bold">
                      <td className="px-4 py-2 border">TOTAL</td>
                      <td className="px-4 py-2 border text-right">{totals.software}</td>
                      <td className="px-4 py-2 border text-right">{totals.domain}</td>
                      <td className="px-4 py-2 border text-right">{totals.server}</td>
                      <td className="px-4 py-2 border text-right">{totals.utility}</td>
                      <td className="px-4 py-2 border text-right">{totals.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Mobile Card View */}
            {isMobile && (
              <div className="mt-4">
                <div className="text-base font-semibold text-gray-600 mb-2">Unit: Currency (INR)</div>
                {monthlyData.map((data, index) => (
                  <MobileCard key={index} data={data} />
                ))}
                <MobileTotalsCard totals={totals} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Report;