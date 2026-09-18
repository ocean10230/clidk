import { useEffect, useRef } from "react"
import { SeededRandom } from "../helpers/randomizer"
import { GameTick } from "../helpers/ticks"

export default function useDos(Save: GameSaveState, tick?: GameTick) {
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
    }, [Save.upgrade.dos, tick])
}