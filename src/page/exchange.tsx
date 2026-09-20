import { useState } from 'react'
import { ChevronUp, Gem, DollarSign, Bitcoin, ArrowRightLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Item = { 
   Icon: React.ReactNode; 
   Title: string;
   ClassName: string;
}

const ALL_ITEMS: Item[] = [
  { Title: "Money", Icon: <DollarSign className="size-5" />, ClassName: "text-money" },
  { Title: "Gem", Icon: <Gem className="size-5" />, ClassName: "text-gem" },
  { Title: "BTC", Icon: <Bitcoin className="size-5" />, ClassName: "text-bc" }
]

interface DropdownProps {
  items: Item[]
  selected: Item
  onSelect: (item: Item) => void
}

const Dropdown = ({ items, selected, onSelect }: DropdownProps) => {
   const [dropped, setDropped] = useState(false)

   return (
      <div className="relative w-full">
         <div 
            className={`${selected.ClassName} w-full border border-accent/25 ${!dropped ? "hover:" : ""}bg-white/2 p-3 rounded-md flex items-center justify-between cursor-pointer transition-colors`} 
            onClick={() => setDropped(!dropped)}
         >
            <div className="flex items-center gap-2 font-medium">
               { !dropped ? selected.Icon : <ChevronUp /> } 
               <span>{ selected.Title }</span>
            </div>
         </div>

         <AnimatePresence>
            {dropped && (
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-modal z-50 w-full absolute border-accent/40 rounded-md overflow-hidden border mt-1.5 shadow-xl"
                  transition={{ ease: [0, 0, 0, 1], duration: 0.15 }}
               >
               {items.map((item) => (
                  <div
                     key={item.Title}
                     className={`${item.ClassName} p-3 flex items-center gap-2 cursor-pointer hover:bg-white/2 transition-colors font-medium`}
                     onClick={() => {
                        onSelect(item)
                        setDropped(false)
                     }}
                  >
                     {item.Icon}
                     <p>{item.Title}</p>
                  </div>
               ))}
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   )
}

export default function Exchange({ Save }: { Save: GameSaveState }) {
   const [fromItem, setFromItem] = useState<Item>(ALL_ITEMS[2]) // BTC
   const [toItem, setToItem] = useState<Item>(ALL_ITEMS[0])   // Money
   const [payAmount, setPayAmount] = useState<string>("123")

   const handleSwap = () => {
      setFromItem(toItem)
      setToItem(fromItem)
   }

   const topOptions = ALL_ITEMS.filter((item) => item.Title !== toItem.Title)
   const bottomOptions = ALL_ITEMS.filter((item) => item.Title !== fromItem.Title)

   console.log(fromItem.Title, toItem.Title, Object.keys(Save.prices))

   return (
      <div className="w-full p-4 space-y-4">
         {/* Currency Selectors Row */}
         <div className="flex items-center gap-1">
            <Dropdown 
               items={topOptions} 
               selected={fromItem} 
               onSelect={setFromItem} 
            />

            <button 
               type="button"
               onClick={handleSwap}
               className='p-3'
               title="Swap currencies"
            > 
               <ArrowRightLeft className="size-5" />
            </button>

            <Dropdown 
               items={bottomOptions} 
               selected={toItem} 
               onSelect={setToItem} 
            />
         </div>

         {/* Pay/Receive Inputs Section */}
         <div className="w-full flex flex-col font-rubik gap-3">
            {/* Pay Card */}
            <div className="flex flex-col gap-1.5 p-3.5 rounded-md  border border-accent/20 transition-colors">
               <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                  <span>You pay</span>
                  <span className={fromItem.ClassName}>{fromItem.Title}</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className={`${fromItem.ClassName} shrink-0`}>
                     {fromItem.Icon}
                  </span>
                  <input 
                     type="number"
                     min={  }
                     value={payAmount}
                     onChange={(e) => setPayAmount(e.target.value)}
                     className={"w-full bg-transparent outline-none font-lexend font-semibold text-lg placeholder:text-gray-600 " + fromItem.ClassName}
                     placeholder="0" 
                  />
               </div>
            </div>

            {/* Receive Card */}
            <div className="flex flex-col gap-1.5 p-3.5 rounded-md  border border-accent/20">
               <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                  <span>You get</span>
                  <span className={toItem.ClassName}>{toItem.Title}</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className={`${toItem.ClassName} shrink-0`}>
                     {toItem.Icon}
                  </span>
                  <input 
                     readOnly
                     value={
                        Math.floor(Number(payAmount) * Save.prices[fromItem.Title])
                     }
                     type="number" 
                     className={`${toItem.ClassName} w-full bg-transparent outline-none font-lexend font-semibold text-lg`} 
                  />
               </div>
            </div>
         </div>
      </div>
   )
}