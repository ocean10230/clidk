import { useState, useRef } from "react"
import { showToast } from "../components/notifications"
import { File } from "lucide-react"
import { Input } from "../components/floating_inputbar"

export default function SettingsPage({ Save }: { Save: GameSaveState }) {
   const title = useRef<HTMLInputElement>(null)
   const person = useRef<HTMLInputElement>(null)
   const action = useRef<HTMLInputElement>(null)
   const [disabled, setDisabled] = useState(false)

   const UpdateMetadata = () => {
      if (!title.current || !person.current || !action.current) return

      const personValue = person.current.value.trim()
      const actionValue = action.current.value.trim()
      const titleValue  =  title.current.value.trim()

      if (personValue.length < 1)
         return showToast("Ai cũng có tên mà thằng m kêu " + actionValue + " mà ko có tên thì t thế tên m vô à")
      if (personValue.toLocaleLowerCase().includes("ocean"))
         if (personValue.includes("102300") && !actionValue.includes("gym"))
            return showToast("Bắt nó tập gym cho t")
         else
            return showToast("\"Ocean\" cái cc")
      if (personValue.toLowerCase().includes("khang"))
         if (personValue.toLocaleLowerCase().includes("lọ"))
            return showToast("Bắt nó tập gym cho t")
         else
            return showToast("Muốn bị chỉnh thành gay ko?")
      if (actionValue.length < 1)
         return showToast("Tính ko cho việc thằng " + personValue + " à?")
      if (titleValue.length < 1)
         return showToast("Ai không đặt tên save game làm gay")

      Save.updateSaveMetadata(titleValue, personValue, actionValue)
      showToast("Cập nhật thành công")
      setDisabled(true)
      setTimeout(() => setDisabled(false), 2500)
   }

   return (
      <div className="flex flex-col gap-2.5 p-3">
         <p className="text-lg mb-5 font-semibold">Save game</p>

         <div className="flex flex-col gap-2.5">
            <Input
               placeholder="Tên save game" initialValue={Save.metadata.title}
               className="w-full" ref={title}
            />

            <div className="flex items-center gap-1">
               <Input placeholder="Ne lô" ref={person} initialValue={Save.metadata.person} />
               <Input placeholder="Việc cần làm" ref={action} initialValue={Save.metadata.action} />
            </div>

            <button className='items-center flex gap-2' onClick={UpdateMetadata} disabled={disabled}>
               <File />
               Lưu save game
            </button>
         </div>
         
      </div>
   );
}
