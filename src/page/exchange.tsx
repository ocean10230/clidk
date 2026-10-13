import { useState } from 'react'
import { ChevronUp, Gem, DollarSign, Bitcoin, MoveVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Define a single dropdown item type: [Icon/Node, Label Text]
type DropdownItem = [React.ReactNode, string]

interface DropdownProps {
  items: DropdownItem[]
}

const Dropdown = ({ items }: DropdownProps) => {
   const [idx, setidx] = useState(0)
   const [dropped, setDropped] = useState(false)

   return (
     <div className="relative">
       <div 
         className={"border p-3 rounded-md flex items-center gap-1.5 cursor-pointer " + (dropped ? "bg-white/5 border-accent/50" : "border-accent/30")} 
         onClick={() => setDropped(!dropped)}
       >
         {/* Toggle between current selected icon and ChevronUp */}
         {!dropped ? items[idx][0] : <ChevronUp />} 
         <span>{items[idx][1]}</span>
       </div>

       <AnimatePresence>
         {dropped && (
           <motion.div
             initial={{ opacity: 0, y: -15 }}
             exit={{ opacity: 0, y: -15 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-modal z-50 w-full absolute border-accent/50 rounded-md overflow-x-hidden overflow-y-auto border mt-1"
             transition={{ ease: [0, 0, 0, 1], duration: 0.2 }}
           >
             {items.map(([Icon, Text], i) => (
               <div
                 key={i}
                 className={"p-3 flex items-center gap-1 cursor-pointer " + (idx === i ? "bg-white/5" : "")}
                 onClick={() => {
                   setidx(i)
                   setDropped(false) // Close dropdown on selection
                 }}
               >
                 {Icon}
                 <p>{Text}</p>
               </div>
             ))}
           </motion.div>
         )}
       </AnimatePresence>
     </div>
   )
}

const CURRENCY_ITEMS: DropdownItem[] = [
  [<Gem key="gem" />, "Gem"], 
  [<Bitcoin key="btc" />, "BTC"], 
  [<DollarSign key="usd" />, "Money"]
]

export default function Exchange() {
   return (
     <div className="w-full p-3 flex flex-col gap-3">
       <div>
         <Dropdown items={CURRENCY_ITEMS} />
       </div>

       <button className="font-normal flex items-center gap-2 w-full justify-center py-2"> 
         <MoveVertical /> Swap 
       </button>

       <div>
         <Dropdown items={CURRENCY_ITEMS} />
       </div>
     </div>
   )
}