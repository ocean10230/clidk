import { useEffect, useRef } from "react"
import { SeededRandom } from "../helpers/randomizer"
import { sleep } from "../helpers/function"
import { showToast } from "../components/notifications"

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
    "Ocean30", "Ocean102300 (gay)", "Unit01",
    "U văn đít", "Minh Đăng", "Cô bán cá ngoài chợ",
    "Duy Minh", "Dui Minh", "Ocean10230", "Ocean102",
    "Danh Lọ", "Nguyên Lọ", "C3H6S"
]

const ClickAsFriend = async (Save: GameSaveState, seededRandom: SeededRandom) => {
    let stealCount = 0
    
    for (let i = 0; i < Save.upgrade.friends; i++) {
        Save.addClick()

        // Allow up to 2 thefts per batch instead of 3 (keeps max penalty predictable)
        if (stealCount < 2 && seededRandom.Float() < 0.02) {
            // 1. Ensure multiplier ratio never drops below 1
            const baseSteal = seededRandom.RangedFloat(20, 40) * Math.max(1, Save.upgrade.multiplier / 5)
            
            // 2. Use percentage discount (e.g. 1.5% off per friend, capped at 60% max discount)
            const friendDiscount = Math.min(0.60, Save.upgrade.friends * 0.015)
            const rawSteal = baseSteal * (1 - friendDiscount)
            const stealAmount = Math.floor(rawSteal)
            const expensiveDeduction = seededRandom.RangedFloat(0,1) < 0.1

            const actualDeduction = Math.min(Save.data.money, stealAmount) * (expensiveDeduction ? seededRandom.RangedFloat(2,3.5) : 1)

            
            if (actualDeduction > 0) {
                Save.addMoney(-actualDeduction)
                stealCount++
                console.log(`Friend took $${actualDeduction}!`)
            }

            
            if (actualDeduction > 0) {
                if (expensiveDeduction)
                    showToast(
                        Friends[Math.floor(Math.random() * Friends.length)] + ": " +
                        Expensive[Math.floor(Math.random() * Expensive.length)]
                    )
                else
                    showToast(
                        Friends[Math.floor(Math.random() * Friends.length)] + ": " +
                        Message[Math.floor(Math.random() * Message.length)]
                    )
            }
        }

        await sleep(seededRandom.RangedInt(150, 225))
    }
}

export default function useFriendsClicker(Save: GameSaveState) {
    const saveRef = useRef(Save)
    const loopId = useRef(0)
    const seededRandomRef = useRef<SeededRandom>(null)

    saveRef.current = Save

    useEffect(() => {
        seededRandomRef.current = new SeededRandom(
            Save.metadata.seed + Math.floor(Math.random() * 100) + 42
        )
    }, [Save.metadata.seed])

    useEffect(() => {
        if (Save.upgrade.friends === 0 || !seededRandomRef.current) return
        loopId.current++

        let timeoutId: ReturnType<typeof setTimeout>
        const currentLoopId = loopId.current
        const seededRandom = seededRandomRef.current
        const lv = Save.upgrade.friends

        const loop = async () => {
            if (loopId.current !== currentLoopId) return
            await ClickAsFriend(saveRef.current, seededRandom).catch(console.error)

            const nextInterval =
            seededRandom.RangedInt(Math.max(150 / lv - (lv/2), 80), 400/(lv+seededRandom.RangedInt(2,5)))
            timeoutId = setTimeout(loop, nextInterval)
        }

        loop()
    }, [Save.upgrade.friends, seededRandomRef])
}