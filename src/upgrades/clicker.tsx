import { useEffect, useRef } from "react"
import { showToast } from "../components/notifications"
import { sleep } from "../helpers/function"
import { SeededRandom } from "../helpers/randomizer"

export default function useClicker(Save: GameSaveState) {
    const seededRandomRef = useRef<SeededRandom | null>(null)
    const activeLoopIdRef = useRef(0)

    useEffect(() => {
        seededRandomRef.current = new SeededRandom(Save.metadata.seed + Math.random() * 1000)
    }, [Save.metadata?.seed])

    useEffect(() => {
        if (Save.upgrade.auto < 1) return

        const loopId = ++activeLoopIdRef.current
        const random = seededRandomRef.current
        if (!random) return

        const runLoop = async () => {
            while (loopId === activeLoopIdRef.current) {
                const isBroke = random.RangedFloat(0, 1) > (1 - 1 / (Save.upgrade.auto + 5))

                if (isBroke) {
                    Save.broken.auto = true
                    Save.history.broken_auto++;
                }

                const delay = !isBroke
                    ? 1000
                    : random.RangedFloat(4, 15) * 1000

                

                if (isBroke) {
                    showToast(`Auto Clicker hỏng ${(delay / 1000).toFixed(2)} giây`)
                }

                const clickEarnings = (Save.upgrade.multiplier * random.RangedFloat(0.5, 0.7)) + (Save.upgrade.auto * 0.35)
                Save.addMoney(Math.max(1, clickEarnings))
                Save.broken.auto = false
                await sleep(Math.max(300, delay))
            }
        }

        runLoop()
    }, [Save.upgrade.auto, Save.upgrade.multiplier])

    const init = useRef(false)

    useEffect(() => {
        if (!init.current) {
            init.current = true
            return
        }

        showToast("Friends > Clankers bruh")

    }, [ Save.upgrade.auto ])
}