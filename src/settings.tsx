import React, { useState, useEffect, useRef } from "react"
import { showToast } from "./components/notifications"
import { File } from "lucide-react"

import{ forwardRef } from "react"

interface PerfectFloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   placeholder?: string
   initialValue?: string
}

export const PerfectFloatingInput = forwardRef<HTMLInputElement, PerfectFloatingInputProps>(
   (
      { 
         placeholder = "Search", 
         id, 
         initialValue = "",
         className = "",
         value: controlledValue,
         onChange,
         onFocus,
         onBlur,
         ...rest
      }, 
      ref // Nhận ref ở vị trí tham số thứ 2
   ) => {
      const [internalValue, setInternalValue] = useState(initialValue)
      const [isFocused, setIsFocused] = useState(false)

      const currentValue = controlledValue !== undefined ? String(controlledValue) : internalValue
      const isShrunk = isFocused || currentValue.length > 0

      useEffect(() => {
         setInternalValue(initialValue)
      }, [initialValue])

      return (
         <div className={`relative w-full font-lexend ${className}`}>
            <fieldset
               className={`absolute inset-0 pointer-events-none rounded border -mt-1.5 px-2 transition-colors duration-200 ${
                  isFocused ? "border-accent-bright" : "border-gray-300 hover:border-gray-900"
               }`}
            >
               <legend
                  className={`ml-1 text-xs font-normal transition-all duration-200 h-2 block pointer-events-none opacity-0 whitespace-nowrap ${
                     isShrunk ? "max-w-full px-1" : "max-w-0 px-0"
                  }`}
               >
                  {placeholder}
               </legend>
            </fieldset>

            <input
               {...rest}
               ref={ref} // Truyền ref trực tiếp vào thẻ input ở đây
               id={id}
               type="text"
               value={currentValue}
               onChange={(e) => {
                  setInternalValue(e.target.value)
                  onChange?.(e)
               }}
               onFocus={(e) => {
                  setIsFocused(true)
                  onFocus?.(e)
               }}
               onBlur={(e) => {
                  setIsFocused(false)
                  onBlur?.(e)
               }}
               className="w-full px-3 py-2.5 text-sm bg-transparent outline-none z-10 relative"
            />

            <label
               htmlFor={id}
               className={`absolute left-3 pointer-events-none transition-all duration-200 ease-out z-20 origin-top-left ${
                  isShrunk
                     ? "top-0 ml-1 -translate-y-1/2 scale-75"
                     : "top-1/2 -translate-y-1/2 scale-100 text-sm"
               } ${isFocused ? "text-accent-bright" : "text-gray-300"}`}
            >
               {placeholder}
            </label>
         </div>
      )
   }
)

PerfectFloatingInput.displayName = "PerfectFloatingInput"

export default function SettingsPage({ Save }: { Save: GameSaveState }) {
   const title = useRef<HTMLInputElement>(null)
   const person = useRef<HTMLInputElement>(null)
   const action = useRef<HTMLInputElement>(null)

   const UpdateMetadata = () => {
      if (!title.current || !person.current || !action.current) return

      const personValue = person.current.value.trim()
      const actionValue = action.current.value.trim()
      const titleValue  =  title.current.value.trim()

      if (personValue.length < 1)
         return showToast("Ai cũng có tên mà thằng m kêu " + actionValue + " mà ko có tên thì t thế tên m vô à")
      if (personValue.includes("Ocean")) {
         if (personValue.includes("102300") && !actionValue.includes("gym"))
            return showToast("Bắt nó tập gym cho t")
         else
            return showToast("\"Ocean\" cais cc")
      }
      if (actionValue.length < 1)
         return showToast("Tính ko cho việc thằng " + personValue + " à?")
      if (titleValue.length < 1)
         return showToast("Ai không đặt tên save game làm gay")

      Save.updateSaveMetadata(titleValue, personValue, actionValue)
      showToast("Cập nhật thành công")
   }

   return (
      <div className="flex flex-col gap-2.5 p-3">
         <p className="text-lg mb-5 font-semibold">Save game</p>

         <div className="flex flex-col gap-2.5">
            <PerfectFloatingInput
               placeholder="Tên save game" initialValue={Save.metadata.title}
               className="w-full" ref={title}
            />

            <div className="flex items-center gap-1">
               <PerfectFloatingInput placeholder="Ne lô" ref={person} initialValue={Save.metadata.person} />
               <PerfectFloatingInput placeholder="Việc cần làm" ref={action} initialValue={Save.metadata.action} />
            </div>

            <button className='items-center flex gap-2' onClick={UpdateMetadata}>
               <File />
               Lưu save game
            </button>
         </div>
         
      </div>
   );
}
