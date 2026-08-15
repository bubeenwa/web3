import React, { useState } from 'react'
import { useWallet } from './WalletProvider'
import { submitTransaction, simulateInvoke } from '../lib/soroban'

export default function WriteMessage({ contractId, onDone }: { contractId: string, onDone?: ()=>void }){
  const wallet = useWallet()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(){
    setError(null)
    if(!wallet.publicKey) return setError('Please connect or import a key')
    if(!contractId) return setError('Paste a deployed contract ID first')
    if(!text || text.length>280) return setError('Enter a message (max 280 chars)')

    setLoading(true)
    try{
      // Simulate (best-effort) - UI shows that we will attempt to sign and submit
      const tx = await simulateInvoke(contractId, wallet.publicKey, text)

      // Sign & submit
      const res = await submitTransaction(tx, wallet)
      console.log('submit result', res)
      setText('')
      onDone && onDone()
    }catch(e:any){
      console.error(e)
      setError(String(e?.message || e))
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900/60 p-4 rounded">
      <h4 className="font-semibold mb-2">Write a message</h4>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Hello Soroban!" className="w-full p-3 rounded bg-slate-800 text-sm h-28" />
      {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      <div className="flex justify-end mt-3">
        <button className="px-4 py-2 rounded bg-amber-400 text-black font-semibold" onClick={handleSubmit} disabled={loading}>{loading? 'Sending...' : 'Send on-chain'}</button>
      </div>
    </div>
  )
}
