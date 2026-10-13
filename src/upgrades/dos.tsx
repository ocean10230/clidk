import { useEffect, useRef } from "react"
import { SeededRandom } from "@/helpers/randomizer"
import { GameTick } from "@/helpers/ticks"

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
        if (Save.upgrade.dos < 1 || !random) return

        const attemptGlitch = () => {
	    const base = random.RangedFloat(0, Save.upgrade.dos * random.RangedFloat(1,100))
	    const chance = Math.min(50,Save.upgrade.dos)
        console.log(base, chance)
	}

        const onTick = (e: Event) => {
            const { elapsedMs } = (e as CustomEvent).detail
            accumulatedRef.current += elapsedMs

            while (accumulatedRef.current >= random.RangedInt(2500, 6700)) {
                accumulatedRef.current -= nextDelayRef.current
                attemptGlitch()
            }
        }

        tick.addEventListener("tick_elapsed", onTick)
        return () => tick.removeEventListener("tick_elapsed", onTick)
    }, [Save.upgrade.dos, tick])
}
