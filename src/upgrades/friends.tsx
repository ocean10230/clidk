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
    "Ocean30", "Ocean102300 (unit01 gay)", "Unit01", "🟣🟢",
    "U văn đít", "Minh Đăng", "Cô bán cá ngoài chợ", "Chú ong Jollibee",
    "Duy Minh", "Dui Minh", "Ocean10230", "Ocean102", "Master Chef 8/2",
    "Danh Lọ", "Nguyên Lọ", "C3H6S",
    "Tungtung"
]

const ClickAsFriend = async (
    Save: GameSaveState, 
    seededRandom: SeededRandom, 
    isCancelled: () => boolean
) => {
    let stealCount = 0
    
    for (let i = 0; i < Save.upgrade.friends; i++) {
        // Stop execution immediately if effect cleanup was triggered
        if (isCancelled()) return;

        Save.addClick()

        if (stealCount < 2 && seededRandom.Float() < 0.02) {
            const baseSteal = seededRandom.RangedFloat(20, 40) * Math.max(1, Save.upgrade.multiplier / 5)
            const friendDiscount = Math.min(0.50, Save.upgrade.friends * 0.025)
            const rawSteal = baseSteal * (1 - friendDiscount / seededRandom.RangedInt(2, 5))
            const stealAmount = Math.floor(rawSteal)
            const expensiveDeduction = seededRandom.RangedFloat(0, 1) < 0.1

            const actualDeduction = Math.min(Save.data.money, stealAmount) * (expensiveDeduction ? seededRandom.RangedFloat(2, 3.5) : seededRandom.RangedFloat(1.5, 2.3))

            if (actualDeduction > 0) {
                Save.addMoney(-actualDeduction)
                stealCount++
                console.log(`Friend took $${actualDeduction}!`)
            }

            if (actualDeduction > 0) {
                const name = Friends[Math.floor(Math.random() * Friends.length)] + ": "
                const deducted = `(-$${Math.floor(actualDeduction)})`
                if (expensiveDeduction)
                    showToast(
                        name +
                        Expensive[Math.floor(Math.random() * Expensive.length)] + " " + deducted
                    )
                else
                    showToast(
                        name +
                        Message[Math.floor(Math.random() * Message.length)] + " " + deducted
                    )
            }
        }

        await sleep(seededRandom.RangedInt(100, 200))
    }
}

export default function useFriendsClicker(Save: GameSaveState) {
    const saveRef = useRef(Save)
    const seededRandomRef = useRef<SeededRandom>(null)

    saveRef.current = Save

    useEffect(() => {
        seededRandomRef.current = new SeededRandom(
            Save.metadata.seed + Math.floor(Math.random() * 100) + 42
        )
    }, [Save.metadata.seed])

    useEffect(() => {
        if (Save.upgrade.friends === 0 || !seededRandomRef.current) return

        let cancelled = false
        let timeoutId: ReturnType<typeof setTimeout>

        const seededRandom = seededRandomRef.current
        const lv = Save.upgrade.friends

        const loop = async () => {
            if (cancelled) return

            await ClickAsFriend(saveRef.current, seededRandom, () => cancelled).catch(console.error)

            if (cancelled) return

            const nextInterval = seededRandom.RangedInt(
                Math.max(150 / lv - lv / 1.5, 80), 
                400 / (lv + seededRandom.RangedFloat(1.5, 3))
            )
            
            timeoutId = setTimeout(loop, nextInterval)
        }

        loop()

        return () => {
            cancelled = true
            clearTimeout(timeoutId)
        }
    }, [Save.upgrade.friends, Save.upgrade.multiplier])
}