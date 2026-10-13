import './styling.css'

import { Route } from 'react-router-dom'
import { Routes, useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, MousePointer2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameSave } from '@/game_save.tsx'

import App from '@/page/game.tsx'
import SettingsPage from '@/page/settings.tsx'
import Upgrading from '@/page/shop.tsx'
import Exchange from '@/page/exchange.tsx'

import useFriendsClicker from '@/upgrades/friends.tsx'
import useClicker from '@/upgrades/clicker.tsx'
import useDos from '@/upgrades/dos.tsx'
import useMocking from '@/components/mocker.tsx'

import { GameTick } from '@/helpers/ticks.tsx'
import { useEffect, useRef } from 'react'

const Header = ({ location }: { location: string }) => {
  const navigate = useNavigate()
  const index = location !== "/"

  return (<div className="flex justify-between items-center bg-accent/5 rounded-t-md p-3">
    <div className="flex items-center gap-2">
      <div
        onClick={() => (index && navigate("/"))}
        className={"size-8 p-1 rounded-md bg-accent/5 border border-accent/20 center " + (index && "hover:bg-accent/10")}
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

export const GameWrapper = () => {
  const location = useLocation()
  const Game = useGameSave()
  const TickSystem = useRef<GameTick>(undefined)
  useEffect(() => { 
    TickSystem.current = new GameTick(200, Game)
    return TickSystem.current.stop
  }, [])
  
  useClicker(Game, TickSystem.current)
  useFriendsClicker(Game, TickSystem.current)
  useDos(Game, TickSystem.current)
  useMocking(Game)

  return (<div className="md:w-120 h-130 flex flex-col justify-between bg-modal border-accent/10 border rounded-md">
    <Header location={location.pathname} />
    <Transition location={location}>
        <Routes>
        <Route path="*" element={<App />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/upgrades" element={<Upgrading /> } />
        <Route path="/exchange" element={<Exchange />} />
      </Routes>
    </Transition>
  </div>)
}
