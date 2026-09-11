import { createRoot } from 'react-dom/client'
import './assets/styling.css'
import App from './game.tsx'
import { BrowserRouter, Route } from 'react-router-dom'
import { Routes, useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, MousePointer2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import SettingsPage from './settings.tsx'
import Upgrading from './shop.tsx'
import { useEffect } from 'react'
import { useGameSave } from './game_save.tsx'
import Clicker from './upgrades/clicker.tsx'
import useFriendsClicker from './upgrades/friends.tsx'
import useClicker from './upgrades/clicker.tsx'


const Header = ({ location }: { location: string }) => {
  const navigate = useNavigate()
  const index = location !== "/"

  return (<div className="flex justify-between items-center bg-accent/5 rounded-t-md p-3">
    <div className="flex items-center gap-2">
      <div
        onClick={() => (index && navigate("/"))}
        className="size-8 p-1 rounded-md bg-accent/5 border border-accent/20 center"
        style={{ cursor: index ? "pointer" : "default" }}
      >
        { index ? <ChevronLeft/> : <MousePointer2 /> }
      </div>
      <p className="font-semibold text-[18px] font-lexend">Clidk</p>
    </div>

    <span className="bg-accent/30 border-accent/50 border px-2.5 font-light font-rubik p-0.5 rounded-md">v0.0.5</span>
  </div>)
}

const Transition = ({children, location}:{children: React.ReactNode, location: any}) =>
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0.2 }}
    animate={{ opacity: 1 }}
    exit={{ transition: { duration: 0 } }}
    transition={{ duration: 0.5, ease:[0,0,0,1] }}
    className="flex flex-col justify-between h-full w-full"
  >
    {children}
  </motion.div>
</AnimatePresence>

const Wrapper = () => {
  const location = useLocation()
  const Game = useGameSave()

  useClicker(Game)
  useFriendsClicker(Game)

  return (<div className="center h-screen">
    <div className="w-105 h-100 flex flex-col justify-between bg-modal border-accent/10 border rounded-md">
      <Header location={location.pathname} />

      <Transition location={location}>
        <Routes>
          <Route path="*" element={<App Save={Game} />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/upgrades" element={<Upgrading Save={Game} /> } />
        </Routes>
      </Transition>
    </div>
  </div>)
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Wrapper/>
  </BrowserRouter>
)
