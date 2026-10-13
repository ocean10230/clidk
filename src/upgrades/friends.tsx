import { useEffect, useRef } from "react"
import { SeededRandom } from "@/helpers/randomizer"
import { showToast } from "@/components/notifications"
import { Mathmin } from "@/helpers/math"
import { GameTick } from "@/helpers/ticks"

const Message = [
    "Xin nha bro 🤑", "Please speed i need this",
    "my mom kinda homeless :sob:",
    "Xin tiền mua đồ ăn nha bro",
    "I need money"
]

const Expensive = [
    "Xin tiền mua 3090", "I need to đầu tư vào bitcoin",
    "Máy ko đủ ram chạy game dell cày hộ được", "I need 9070 XT",
    "Xin tiền mua 4090 :)", "Tăng lương đi bro ít tiền quá",
    "thuế ${money}"
]

const Friends = [
    "Kiệt", "Khang", "Lọ Quốc Khang",
    "Ocean30", "Ocean102300 (unit01 gay)", "Unit01", "🟣🟢",
    "U văn đít", "Minh Đăng", "Cô bán cá ngoài chợ", "Chú ong Jollibee",
    "Duy Minh", "Dui Minh", "Ocean10230", "Ocean102", "Master Chef 8/2",
    "Danh Lọ", "Nguyên Lọ", "C3H6S", "Obama",
    "Tungtung", "Do 500", "tungtungsocu"
]

const ClickAsFriend = (
    Save: GameSaveState, 
    seededRandom: SeededRandom
) => {
    // Single execution per tick trigger instead of async looping
    Save.addClick()

    // Friend theft logic
    if (seededRandom.Float() < 0.02) {
        const baseSteal = seededRandom.RangedFloat(20, 40) * Math.max(1, Save.upgrade.multiplier / 5)
        const friendDiscount = Math.min(0.50, Save.upgrade.friends * 0.025)
        const rawSteal = baseSteal * (1 - friendDiscount / seededRandom.RangedInt(2, 5))
        const stealAmount = Math.floor(rawSteal)
        const expensiveDeduction = seededRandom.RangedFloat(0, 1) < 0.1

        const actualDeduction = Mathmin(Save.data.money, BigInt(stealAmount)) * BigInt(
            Math.floor(expensiveDeduction ? seededRandom.RangedFloat(3, 5) : seededRandom.RangedFloat(1.2, 1.67))
        )

        if (actualDeduction > 0n) {
            Save.addMoney(-actualDeduction)
            
            const name = Friends[Math.floor(Math.random() * Friends.length)] + ": "
            const deducted = `(-$${actualDeduction})`
            const msgList = expensiveDeduction ? Expensive : Message
            const text = msgList[Math.floor(Math.random() * msgList.length)]
            
            showToast(`${name}${text.replaceAll("{money}", actualDeduction.toString())} ${!text.includes("${money}") ? deducted : ""}`)
        }
    }
}

export default function useFriendsClicker(Save: GameSaveState, tick?: GameTick) {
    const saveRef = useRef(Save)
    const seededRandomRef = useRef<SeededRandom | null>(null)
    const accumulatedRef = useRef(0)
    const nextIntervalRef = useRef(0)

    saveRef.current = Save

    useEffect(() => {
        seededRandomRef.current = new SeededRandom(
            Save.metadata.seed + Math.floor(Math.random() * 100) + 42
        )
    }, [Save.metadata.seed])

    useEffect(() => {
        if (!tick) return;
        const lv = Save.upgrade.friends
        const seededRandom = seededRandomRef.current
        if (lv === 0 || !seededRandom) return

        const rollInterval = () => {
            const minInterval = Math.max(150 / lv, 80)
            const maxInterval = Math.max(
                minInterval,
                10_000 / (lv + seededRandom.RangedFloat(1.2, 2))
            )
            return seededRandom.RangedInt(minInterval, maxInterval)
        }

        nextIntervalRef.current = rollInterval()
        accumulatedRef.current = 0

        const onTick = (e: Event) => {
            const { elapsedMs } = (e as CustomEvent).detail
            accumulatedRef.current += elapsedMs

            while (accumulatedRef.current >= nextIntervalRef.current) {
                accumulatedRef.current -= nextIntervalRef.current
                ClickAsFriend(saveRef.current, seededRandom)
                nextIntervalRef.current = rollInterval()
            }
        }

        tick.addEventListener("tick_elapsed", onTick)
        return () => tick.removeEventListener("tick_elapsed", onTick)
    }, [Save.upgrade.friends, Save.upgrade.multiplier, tick])
}
