import React, { createContext, useContext, useState } from 'react'

type Toast = { id: number; text: string }
const ToasterContext = createContext<{ push: (t: string) => void } | null>(null)

export const useToaster = () => {
  const ctx = useContext(ToasterContext)
  if (!ctx) throw new Error('useToaster must be used inside ToasterProvider')
  return ctx
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Toast[]>([])
  function push(text: string) {
    const id = Date.now()
    setList(s => [...s, { id, text }])
    setTimeout(() => setList(s => s.filter(t => t.id !== id)), 4000)
  }
  return (
    <ToasterContext.Provider value={{ push }}>
      {children}
      <div className="fixed right-6 bottom-6 space-y-2 z-50">
        {list.map(t => (
          <div key={t.id} className="bg-white/5 backdrop-blur text-white px-4 py-2 rounded shadow">
            {t.text}
          </div>
        ))}
      </div>
    </ToasterContext.Provider>
  )
}
