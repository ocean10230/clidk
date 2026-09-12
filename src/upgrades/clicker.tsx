import { useEffect, useRef } from "react";
import { showToast } from "../components/notifications";
import { sleep } from "../helpers/function";
import { SeededRandom } from "../helpers/randomizer";

export default function useClicker(Save: GameSaveState) {
    const seededRandomRef = useRef<SeededRandom | null>(null);
    const activeLoopIdRef = useRef(0);

    // Seed initialization belongs inside useEffect to avoid side-effects on re-render
    useEffect(() => {
        if (!seededRandomRef.current && Save.metadata?.seed != null) {
            seededRandomRef.current = new SeededRandom(Save.metadata.seed + Math.random() * 1000);
        }
    }, [Save.metadata?.seed]);

    useEffect(() => {
        if (Save.upgrade.auto < 1) return;

        // Track each specific loop execution with an incrementing ID
        const loopId = ++activeLoopIdRef.current;
        const random = seededRandomRef.current;
        if (!random) return;

        const runLoop = async () => {
            // Check loopId to guarantee only the latest effect instance runs
            while (loopId === activeLoopIdRef.current) {
                const isBroke = random.RangedFloat(0, 1) > (1 - 1 / (Save.upgrade.auto + 3.5));
                const delay = !isBroke 
                    ? 1000 
                    : random.RangedFloat(10, 20) * 1000;

                if (isBroke) {
                    showToast(`Auto Clicker hỏng ${(delay / 1000).toFixed(2)} giây`);
                }

                const clickEarnings = (Save.upgrade.multiplier * random.RangedFloat(0.5, 0.7)) + (Save.upgrade.auto * 0.25);
                Save.addMoney(Math.max(1, clickEarnings));

                await sleep(Math.max(300, delay));
            }
        };

        runLoop();

        // Cleanup immediately invalidates the loop ID to prevent concurrent executions
        return () => {
            activeLoopIdRef.current = 0;
        };
    }, [Save.upgrade.auto, Save.upgrade.multiplier]);
}