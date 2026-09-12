import toast, { Toaster } from "react-hot-toast"
import { AnimatePresence, motion } from "framer-motion"

const ids: string[] = []

export default function NotificationWrapper() {
    return <div className="overflow-hidden flex flex-col gap-1 py-3 justify-end items-center pointer-events-none absolute top-0 left-0 w-screen h-screen">
        <AnimatePresence>
            <Toaster
                position={"bottom-center"}
                toastOptions={{
                    duration: 3000
                }}
            />
        </AnimatePresence>
    </div>
}

export const showToast = (message: string) => {
    const id = toast.custom((t) => <>
        {t.visible && (
        <motion.div
            className="rounded-md bg-modalbg p-2 px-4 border-accent/50 border"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }} // Smooth fade out when it dismisses
            transition={{ duration: 0.5, ease: [0, 0, 0, 1] }}
        >
            <p className="font-lexend tracking-tight text-white">
                {message}
            </p>
        </motion.div>
        )}
    </>);

    ids.push(id)

    if (ids.length > 5) {
        const oldest = ids.shift()
        toast.dismiss(oldest)
    }

};