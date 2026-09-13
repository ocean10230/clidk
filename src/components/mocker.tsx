import { useEffect } from "react";
import { showToast } from "./notifications";
import toast from "react-hot-toast";

const Messages = [

"Bro kêu {name} thêm một lần nữa không được à?",
"Ngoài việc kêu {name} {act} thì không đi chạm cỏ được à?",
"Chạm cỏ đi bro dù gì {name} có chịu {act} đâu",
"Chạm cỏ đi", "Chạm cỏ dih :wilted_rose:",
"Hỏi lại {name} đi?"

]

export default function useMocking(Save: GameSaveState) {
    useEffect(() => {

        let timeout: number = 0

        const loop = async () => {
            if (Save.metadata.confirmed) return

            showToast(
                Messages[Math.floor(Math.random() * Messages.length)].replace("{name}", Save.metadata.person).replace("{act}", Save.metadata.action),
                {
                    title: Save.metadata.person + " không chịu nghe 🥀",
                    onClick: (t) => {
                        Save.confirm()
                        toast.dismiss(t.id)
                        showToast("Vaiz ca hai hon daiz")
                    }
                }
            )

            timeout = setTimeout(loop, Math.max( Math.random() * 80_000, 30_000 ))
        }

        loop()

        return () => clearTimeout(timeout)
    }, [])
}