import { useEffect, useRef } from "react"
import { SeededRandom } from "../helpers/randomizer"
import { sleep } from "../helpers/function"

const ClickAsFriend = async (Save: GameSaveState, seededRandom: SeededRandom) => {
    let stealCount = 0
    
    for (let i = 0; i < Save.upgrade.friends; i++) {
        Save.addClick()

        // Allow up to 2 thefts per batch instead of 3 (keeps max penalty predictable)
        if (stealCount < 2 && seededRandom.Float() < 0.05) {
            // 1. Ensure multiplier ratio never drops below 1
            const baseSteal = seededRandom.RangedFloat(20, 40) * Math.max(1, Save.upgrade.multiplier / 5)
            
            // 2. Use percentage discount (e.g. 1.5% off per friend, capped at 60% max discount)
            const friendDiscount = Math.min(0.60, Save.upgrade.friends * 0.015)
            const rawSteal = baseSteal * (1 - friendDiscount)
            const stealAmount = Math.floor(rawSteal)

            const actualDeduction = Math.min(Save.data.money, stealAmount)
            
            if (actualDeduction > 0) {
                Save.addMoney(-actualDeduction)
                stealCount++
                console.log(`Friend took $${actualDeduction}!`)
            }
        }

        await sleep(seededRandom.RangedInt(150, 225))
    }
}

export default function useFriendsClicker(Save: GameSaveState) {
    const saveRef = useRef(Save)
    saveRef.current = Save

    useEffect(() => {
        if (Save.upgrade.friends === 0) return

        let isMounted = true
        let timeoutId: ReturnType<typeof setTimeout>
        const seededRandom = new SeededRandom(
            Save.metadata.seed + Math.floor(Math.random() * 100) + 42
        )

        const loop = async () => {
            if (!isMounted) return

            await ClickAsFriend(saveRef.current, seededRandom).catch(console.error)

            if (isMounted) {
                const nextInterval = seededRandom.RangedInt(200, 400)
                timeoutId = setTimeout(loop, nextInterval)
            }
        }

        loop()

        return () => {
            isMounted = false
            clearTimeout(timeoutId)
        }
    }, [Save.upgrade.friends])
}