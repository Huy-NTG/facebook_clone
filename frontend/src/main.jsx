import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GlobalStyles from './components/globalStyles/GlobalStyles.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyles>
        <App />
    </GlobalStyles>
  </StrictMode>,
)
