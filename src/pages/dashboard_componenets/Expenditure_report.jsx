// import React from 'react'
import Expenseanalysis from './Expenseanalysis'
import Report from './Report'

function Expenditure_report() {
  return (
    <div>
      <div><Expenseanalysis/></div>
      <div className='mt-4 rounded'>
        <Report/>
      </div>
    </div>
  )
}

export default Expenditure_report