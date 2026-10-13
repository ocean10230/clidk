import { X } from "lucide-react"
import { useEffect, useState } from "react"

function DisplayContent({ error }: { error: Error }) {
  const [activeTab, setActiveTab] = useState<'script' | 'stack'>('script')
  const [sourceCode, setSourceCode] = useState<string>('Loading source code...')
  const [errorLine, setErrorLine] = useState<number | null>(null)
  const [filePath, setFilePath] = useState<string>('')

  useEffect(() => {
    try {
      const stackLines = error.stack?.split('\n') || []
      let foundPath = ''
      let foundLine = 0

      // Parse stack trace for file path and line number
      for (const line of stackLines) {
        const match = line.match(/(?:https?:\/\/[^/]+)?(\/[^:]+\.[jt]sx?|src\/[^:]+\.[jt]sx?):(\d+):(\d+)/) || 
                      line.match(/([a-zA-Z0-9_\-./]+\.[jt]sx?):(\d+):(\d+)/)
        if (match) {
          foundPath = match[1]
          foundLine = parseInt(match[2], 10)
          break
        }
      }

      if (foundPath) {
        setFilePath(foundPath)
        setErrorLine(foundLine)

        // Normalize path for fetch request
        const fetchUrl = foundPath.startsWith('http') 
          ? foundPath 
          : foundPath.startsWith('/') ? foundPath : `/${foundPath}`

        fetch(fetchUrl)
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
            return res.text()
          })
          .then(text => {
            setSourceCode(text)
          })
          .catch(err => {
            setSourceCode(`// Could not fetch source file (${fetchUrl}).\n// Note: This relies on your dev server (like Vite) serving source files.\n// Error: ${err.message}`)
          })
      } else {
        setSourceCode('// Could not parse file path and line number from stack trace.')
      }
    } catch (e: any) {
      setSourceCode(`// Error parsing stack trace: ${e.message}`)
    }
  }, [error])

  // Extract 5 lines around the error line
  const renderScriptSnippet = () => {
    if (!errorLine || sourceCode.startsWith('//')) {
      return <pre className='p-3 text-xs font-mono whitespace-pre-wrap'>{sourceCode}</pre>
    }

    const lines = sourceCode.split('\n')
    const start = Math.max(0, errorLine - 3)
    const end = Math.min(lines.length, errorLine + 3)
    const snippetLines = lines.slice(start, end)

    return (
      <div className='p-3 font-mono text-xs overflow-x-auto'>
        <p className='text-accent-bright mb-2 text-xs'>
          File: <span className='underline'>{filePath}</span> (around line {errorLine})
        </p>
        <div className='bg-black/50 p-2 rounded border border-accent/20'>
          {snippetLines.map((lineContent, idx) => {
            const currentLineNum = start + idx + 1
            const isErrorLine = currentLineNum === errorLine
            return (
              <div 
                key={currentLineNum} 
                className={`flex items-center px-1 ${isErrorLine ? 'bg-red-500/20 border-l-2 border-red-500 text-red-200 font-bold' : 'text-text/70'}`}
              >
                <span className='w-8 text-right pr-3 select-none text-text/40 font-semibold'>{currentLineNum}</span>
                <span className='whitespace-pre'>{lineContent}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className='no-scrollbar relative overflow-auto h-80 mt-3 bg-modalbg2 border border-accent-bright/20 rounded-md'>
      <div className='backdrop-blur-xs select-none sticky top-0 left-0 flex w-full items-center z-10'>
        <div 
          onClick={() => setActiveTab('script')}
          className={`flex-1 p-2 px-4 border-text/20 border bg-modal flex items-center justify-center cursor-pointer transition-colors ${activeTab === 'script' ? 'bg-accent/20 text-accent-bright' : 'opacity-70'}`}
        >
          Script View (Around Error)
        </div>
        <div 
          onClick={() => setActiveTab('stack')}
          className={`flex-1 p-2 px-4 border-text/20 border bg-modal flex items-center justify-center cursor-pointer transition-colors ${activeTab === 'stack' ? 'bg-accent/20 text-accent-bright' : 'opacity-70'}`}
        >
          Full Stack Trace
        </div>
      </div>

      {activeTab === 'script' ? renderScriptSnippet() : <pre className='p-3 text-xs font-mono whitespace-pre-wrap'>{error.stack}</pre>}
    </div>
  )
}

export function Fallback({ error }: { error: Error }) {
  return (
    <div role="alert" className='md:w-1/2 md:h-1/2 bg-modal rounded-md border border-accent/20'>
      <div className="flex justify-between items-center bg-accent/5 rounded-t-md p-3">
        <div className="flex items-center gap-3">
          <X/>
          <p className="font-semibold text-[18px] font-lexend">Something went wrong</p>
        </div>

        <span className="bg-accent/30 border-accent/50 border px-2.5 font-light font-rubik p-0.5 rounded-md">v0.0.5</span>
      </div>
      
      <div className='p-3'>
        <p><span className='font-semibold'>ErrorType</span>: {error.name}</p>
        <p><span className='font-semibold'>Timestamp</span>: {Date.now()}</p>
        <p>An unknown error has occured, please check your code</p>

        <DisplayContent error={error} />
      </div>
    </div>
  );
}
