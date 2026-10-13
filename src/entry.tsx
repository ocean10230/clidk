import './styling.css'

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import NotificationWrapper from '@/components/notifications.tsx'
import { GameWrapper } from '@/main.tsx'
import { Fallback } from '@/page/error'



const Wrapper = () => {
  return (<div className="center h-screen">
    <NotificationWrapper />
    <ErrorBoundary FallbackComponent={Fallback as ({error}: {error: any}) => React.ReactNode}>
      <GameWrapper/>
    </ErrorBoundary>
  </div>)
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Wrapper/>
  </BrowserRouter>
)
