import './styling.css'

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import NotificationWrapper from './components/notifications.tsx'
import { GameWrapper } from './main.tsx'


const Wrapper = () => {
  return (<div className="center h-screen">
    <NotificationWrapper />
    <GameWrapper/>
  </div>)
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Wrapper/>
  </BrowserRouter>
)
