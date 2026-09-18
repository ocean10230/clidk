import { useEffect, useRef } from "react"
import { showToast } from "../components/notifications"
import { SeededRandom } from "../helpers/randomizer"
import { Mathmax } from "../helpers/math"
import { GameTick } from "../helpers/ticks"

export default function useClicker(Save: GameSaveState, tick?: GameTick) {
    const seededRandomRef = useRef<SeededRandom | null>(null)
    const accumulatedRef = useRef(0)
    const nextDelayRef = useRef(1000)

    useEffect(() => {
        seededRandomRef.current = new SeededRandom(Save.metadata.seed + 999) // fixed offset, deterministic
    }, [Save.metadata?.seed])

    useEffect(() => {
        if (!tick) return
        const random = seededRandomRef.current
        if (Save.upgrade.auto < 1 || !random) return

        const fireAutoClick = () => {
            if (Save.broken.auto) {
                Save.broken.auto = false
            }

            const isBroke = random.RangedFloat(0, 1) > (1 - 1 / (Save.upgrade.auto + 5))
            const delay = !isBroke
                ? 1000
                : random.RangedFloat(4, 15) * 1000

            if (isBroke) {
                Save.broken.auto = true
                Save.history.broken_auto++
            }

            if (isBroke)
                showToast(`Auto Clicker hỏng ${(delay / 1000).toFixed(2)} giây`)

            const clickEarnings = (Save.upgrade.multiplier * random.RangedFloat(0.5, 0.7)) + (Save.upgrade.auto * 0.35)
            Save.addMoney(Mathmax(1n, BigInt(Math.round(clickEarnings))))
            nextDelayRef.current = Math.max(300, delay)
        }

        const onTick = (e: Event) => {
            const { elapsedMs } = (e as CustomEvent).detail
            accumulatedRef.current += elapsedMs

            while (accumulatedRef.current >= nextDelayRef.current) {
                accumulatedRef.current -= nextDelayRef.current
                fireAutoClick()
            }
        }

        tick.addEventListener("tick_elapsed", onTick)
        return () => tick.removeEventListener("tick_elapsed", onTick)
    }, [Save.upgrade.auto, Save.upgrade.multiplier, tick])

    const init = useRef(false)
    useEffect(() => {
        if (!init.current) {
            init.current = true
            return
        }
        showToast("Friends > Clankers bruh")
    }, [Save.upgrade.auto])
}