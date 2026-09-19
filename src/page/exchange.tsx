// padding for nano linux
import { useState, useEffect, type React } from 'react'
import { ChevronUp, Gem, DollarSign, Bitcoin, MoveVertical } from 'lucide-react'
import { motion, AnimatePresence  } from 'framer-motion'

type DropdownItem = [ React.ReactNode | any, string ]
type AcceptableProp  =  DropdownItem[]

const Dropdown = ({ Items }: { Items: AcceptableProp }) => {
    
   const [idx, setidx] = useState(0)
   const [dropped, setDropped] = useState(false)

   return <div className="relative">
      <div className={"border p-3 rounded-md flex items-center gap-1.5 " + (dropped ? "bg-white/5 border-accent/50" : "border-accent/30") }  onClick={() => setDropped(!dropped)}>
         { !dropped ? Items[idx][0] : <ChevronUp/> } <span>{ Items[idx][1] }</span>
      </div>
      <AnimatePresence>
	<motion.div
	   initial={{ opacity: 0, y: -15  }}
	   exit={{ opacity: 0, y: -15 }}
	   animate={dropped ? { opacity: 1, y: 0  } : { opacity: 0, y: -15  }}
	   className={"bg-modal z-50 w-full absolute border-accent/50 rounded-md overflow-x-hidden overflow-y-auto border " + (!dropped && "pointer-events-none")}
	   transition={{ ease: [0,0,0,1], duration: 0.2 }}
	>
	   {Items.map(([ Icon, Text ], i) => <div
		className={"p-3 flex items-center gap-1 " + (idx === i && "bg-white/5")}
		onClick={() => setidx(i)}
	   >
		{Icon}
		<p>{Text}</p>
	   </div>) }
	</motion.div>
      </AnimatePresence>
   </div>
}

const Items = [
  [<Gem/>, "Gem"], [<Bitcoin/>, "BTC"], [<DollarSign/>, "Money"]
]

export default function Exchange({ Save }: { Save: GameSaveState  }) {
   return (<div className="w-full p-3">
     <div>
	<Dropdown Items={Items} />
     </div>

    <button className="font-normal flex items-center gap-2 w-full"> <MoveVertical /> Swap  </button>

    <div>
	<Dropdown Items={Items} />
    </div>
   </div>)
}
