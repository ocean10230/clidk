
import { forwardRef, useState, useEffect } from "react"

interface PerfectFloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   placeholder?: string
   initialValue?: string
}

export const Input = forwardRef<HTMLInputElement, PerfectFloatingInputProps>(
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
                  isFocused ? "border-accent-bright" : "border-gray-500 hover:border-gray-900"
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

Input.displayName = "PerfectFloatingInput"