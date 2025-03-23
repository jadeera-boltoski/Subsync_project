import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoute from './router'
import { Provider } from 'react-redux'
import store from './Redux/store'







createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={store}>
    <div className='font-p'><AppRoute /></div>
    </Provider>
  </StrictMode>,
)
