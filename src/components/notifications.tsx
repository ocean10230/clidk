import toast, { Toaster, type Toast } from "react-hot-toast"
import { AnimatePresence, motion } from "framer-motion"

const ids: string[] = []

export default function NotificationWrapper() {
    return (
        <div className="overflow-hidden flex flex-col gap-1 py-3 justify-end items-center absolute top-0 left-0 w-screen h-screen z-50 pointer-events-none">
            <Toaster
                position="bottom-left"
                toastOptions={{
                    duration: 5000
                }}
            />
        </div>
    )
}

export const showToast = (
    message: string, button?: {
        title: string,
        clickable?: boolean,
        onClick: (t: Toast) => void
    }
) => {
    const id = toast.custom((t) => (
        <AnimatePresence>
            {t.visible && (
                <motion.div
                    key={t.id}
                    className={"flex items-center justify-between gap-5 rounded-md bg-modalbg/40 backdrop-blur-[1px] p-2 px-4 border-accent/50 border"}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0, 0, 0, 1] }}
                >
                    <p className="font-lexend tracking-tight text-white">
                        {message}
                    </p>

                    {
                        button && <button onClick={() => button.onClick(t)}>{button.title}</button>
                    }
                </motion.div>
            )}
        </AnimatePresence>
    ))

    ids.push(id)

    if (ids.length > 3) {
        const oldest = ids.shift()
        toast.dismiss(oldest)
    }
}