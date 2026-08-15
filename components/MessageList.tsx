import React, { useEffect, useState } from 'react'
import { fetchMessages } from '../lib/soroban'
import MessageCard from './MessageCard'

export default function MessageList({ contractId, refreshSignal }: { contractId: string, refreshSignal?: number }){
  const [messages, setMessages] = useState<{ idx:number, text:string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{
    if(!contractId) return
    let mounted = true
    setLoading(true)
    setError(null)
    fetchMessages(contractId).then(msgs=>{
      if(!mounted) return
      setMessages(msgs)
    }).catch(e=>{
      setError(String(e))
    }).finally(()=>setLoading(false))
    return ()=>{ mounted=false }
  }, [contractId, refreshSignal])

  if(!contractId) return <div className="text-slate-400">Paste a contract ID to load messages.</div>

  if(loading) return <div className="text-slate-300">Loading messages...</div>
  if(error) return <div className="text-red-400">{error}</div>

  if(messages.length===0) return <div className="text-slate-400">No messages yet.</div>

  return (
    <div className="space-y-3">
      {messages.map(m=> (
        <MessageCard key={m.idx} idx={m.idx} text={m.text} />
      ))}
    </div>
  )
}
