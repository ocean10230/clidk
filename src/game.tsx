import { Bot, MousePointer2, MoveHorizontal, Settings, ShoppingCart, DollarSign, Send, Gem, Bitcoin } from "lucide-react"

import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Format } from "./helpers/format"

function App({ Save }: { Save: GameSaveState }) {
  const Game = Save
  const navigate = useNavigate()

  return (
      <>
        <div>
          <p className="font-lexend tracking-tight leading-5 p-3">
            Bạn đã kêu {Game.metadata.person} {Game.metadata.action}
            {" "}
            <motion.span
              initial={{ bottom: 10, color:"var(--color-money)" }}
              animate={{ bottom: 0, color:"var(--color-text)" }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="relative"
              key={Game.data.click}
            >
              {Game.data.click} lần
            </motion.span>
            {" "}
            mà {Game.metadata.person} vẫn chưa nghe
          </p>
        </div>

        <div className="p-3 w-full h-full">
          <div className="h-full bg-accent-bright/10 border border-accent-bright/20 rounded-md w-full p-2">
            <p className="mb-2.5 font-lexend font-semibold">Lịch sử:</p>

            <div className="leading-5">
              <p>Bị bắt (DoS): 0 lần</p>
              <p>Bị bắt (Hacking): 0 lần</p>
              <p>Tiền bị trừ: 0 lần</p>
              <p>Auto-click hỏng: 0 lần</p> 
            </div>
          </div>
        </div>
        

        <div className="flex flex-col gap-1.5 p-3">
          
          <div className="flex items-center gap-1">
            <button onClick={() => navigate("/upgrades")}>
              <ShoppingCart />
            </button>

            <button className="w-full" onClick={() => Game.addClick()}>
              { Game.metadata.action.slice(0,1).toLocaleUpperCase() + Game.metadata.action.slice(1) } đi {Game.metadata.person}
            </button>

            <div className="flex items-center justify-between gap-2.5
            border border-accent-bright/50 p-2 rounded-md font-semibold"
            >
              <div className="flex items-center gap-1">
                <MousePointer2 />
                <span>x{Game.upgrade.multiplier}</span>
              </div>

              <div className="w-px bg-white/30 p-px" />

              <div className={"flex items-center gap-1 " + (Game.upgrade.auto > 0 ? "" : "text-gray-500")}>
                <Bot />
                <span>x{Game.upgrade.auto}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="button" onClick={() => navigate("/settings")}>
              <Settings />
            </button>
            <button><MoveHorizontal /></button>
            <button><Send/></button>


            <div className="w-full flex items-center justify-between gap-1
            border border-accent-bright/50 rounded-md font-semibold"
            >
              <div className="text-money flex p-2 pr-1 items-center gap-2 font-rubik">
                <DollarSign />
                <span>{Format(Math.floor(Game.data.money))}</span>
              </div>

              <div className="w-px bg-white/30 p-px" />

              <div className="text-gem pl-1 flex p-2 items-center gap-2 font-rubik">
                 <Gem/>
                 <span>{Format(Game.data.gem)}</span>
              </div>

              <div className="w-px bg-white/30 p-px" />

              <div className="text-bc pl-1 flex p-2 items-center gap-2 font-rubik">
                 <Bitcoin/>
                 <span>{Format(Game.data.crypto)}</span>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}

export default App
