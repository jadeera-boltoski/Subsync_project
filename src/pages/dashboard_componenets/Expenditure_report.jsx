// import React from 'react'
import { useNavigate } from 'react-router-dom'
import Expenseanalysis from './Expenseanalysis'
import Report from './Report'

function Expenditure_report() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex items-center text-sm text-gray-600 pl-3 mb-2">
        <div
          onClick={() => navigate(-1)}
          className="hover:text-blue-600 hover:underline cursor-pointer"
        >
          Dashboard
        </div>
        <div className="mx-1">&gt;</div>
        <div className="text-blue-600">Expenditure Report</div>
      </div>
      <div className='mt-4'><Expenseanalysis /></div>
      <div className='mt-4 rounded'>
        <Report />
      </div>
    </div>
  )
}

export default Expenditure_report