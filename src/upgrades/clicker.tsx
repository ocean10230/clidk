import { SeededRandom } from "../helpers/randomizer";

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