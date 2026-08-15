import React from 'react'

export default function MessageCard({ idx, text }: { idx: number; text: string }) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">#{idx}</div>
      </div>
      <div className="mt-2 text-white font-medium break-words">
        {text}
      </div>
    </div>
  )
}
