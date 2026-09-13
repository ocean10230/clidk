import { File } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface PerfectFloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   placeholder?: string
   initialValue?: string
}

export function PerfectFloatingInput({ 
   placeholder = "Search", 
   id, initialValue = "",
   className,
   ...rest
}: PerfectFloatingInputProps) {
   const [value, setValue] = useState(initialValue || rest.value && String(rest.value) || "")
   const [isFocused, setIsFocused] = useState(false)
   const isShrunk = isFocused || value.length > 0
   const ref = React.useRef<HTMLLabelElement>(null);

   const [labelWidth, setLabelWidth] = React.useState(0);

   useEffect(() => {
      const el = ref.current
      if (el) {
         setLabelWidth(el.clientWidth);
      }
   }, [isFocused])

   return (
      <div className="relative w-full font-lexend">
         <input
            {...rest}
            key={id + initialValue}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-3 py-2.5 text-sm bg-transparent outline-none z-10 relative"
         />

         <label
            className={`absolute left-3 pointer-events-none transition-all duration-200 ease-out z-20 origin-top-left
            ${isShrunk 
               ? 'top-0 -translate-y-1/2 scale-75' 
               : 'top-1/2 -translate-y-1/2 scale-100 text-sm'
            }
            ${isFocused ? 'text-accent-bright' : 'text-gray-300'}
            `}
            ref={ref}
         >
            {placeholder}
         </label>

         <fieldset
            className={`absolute inset-0 pointer-events-none rounded border -mt-1.5 px-2 transition-colors duration-200
            ${isFocused 
               ? 'border-accent-bright' 
               : 'border-gray-300 hover:border-gray-900'
            }`}
         >
            <legend
               className={`invisible text-[10px] font-normal p-0 transition-all duration-200 block h-2
                  
               `}
               style={{
                  width: isShrunk ? `${labelWidth}px` : '0px'
               }}
               
            >

               {placeholder}

            </legend>
         </fieldset>
      </div>
   );
}

export default function SettingsPage() {

  return (
    <div className="flex flex-col gap-2.5 p-3">
        <p className="text-lg mb-5 font-semibold">Save game</p>

        <div className="flex flex-col gap-2.5">
            <PerfectFloatingInput
               placeholder="Tên save game" initialValue=""
               className="w-full"
            />

            <div className="flex items-center gap-1">
               <PerfectFloatingInput placeholder="Ne lô" />
               <PerfectFloatingInput placeholder="Việc cần làm" />
            </div>

            <button className='items-center flex gap-2'>
               <File/>
               Lưu save game
            </button>
        </div>
        
    </div>
  );
}
