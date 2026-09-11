import { useEffect, useRef } from "react";
import { SeededRandom } from "../helpers/randomizer";
import { sleep } from "../helpers/function";

/*

export default function Clicker(Save: GameSaveState) {
    const seededRandom = new SeededRandom(Save.metadata.seed + Math.floor(Math.random() * 100))

    const interval = setInterval(() => { 
        if (Save.upgrade.auto < 1) return clearInterval(interval)       
        const clickEarnings = 
        (Save.upgrade.multiplier * seededRandom.RangedFloat(0.5,0.7))
         + 
        (Save.upgrade.auto * 0.25);
        Save.addMoney(Math.max(1, clickEarnings))
    }, 1000)

    return () => clearInterval(interval)
}


*/

export default function useClicker(Save: GameSaveState) {
    const SeededRandom = useRef<SeededRandom>(null)
    useEffect(() => {
        const random = SeededRandom.current
        if (!random) return

        const loop = async () => {
            const break_chance = random.RangedFloat(0,1)
            if (Save.upgrade.auto < 1) return

            const clickEarnings = (Save.upgrade.multiplier * random.RangedFloat(0.5,0.7)) +  (Save.upgrade.auto * 0.25);
            Save.addMoney(Math.max(1, clickEarnings))
            await sleep(break_chance > 0.05 ? 1000 : (
                random.RangedInt(10,20) * 1000 - random.RangedFloat(0.1,1.1)
            ))
            loop()
        }

        loop()
    }, [Save.upgrade.auto])
}