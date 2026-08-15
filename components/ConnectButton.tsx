import React, { useState } from 'react'
import { useWallet } from './WalletProvider'

export default function ConnectButton(){
  const wallet = useWallet()
  const [open, setOpen] = useState(false)
  const [secret, setSecret] = useState('')

  return (
    <div className="flex items-center space-x-3">
      {wallet.publicKey ? (
        <>
          <div className="px-3 py-2 rounded bg-slate-800 text-sm font-medium">{wallet.publicKey}</div>
          <button className="px-3 py-2 rounded bg-red-500 text-black text-sm" onClick={wallet.disconnect}>Disconnect</button>
        </>
      ) : (
        <>
          <button className="px-4 py-2 rounded bg-emerald-500 text-black font-semibold" onClick={()=>setOpen(true)}>Import Key</button>
          {open && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-black/60 absolute inset-0" onClick={()=>setOpen(false)} />
              <div className="bg-slate-900 p-6 rounded-lg z-10 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-2">Import secret key (dev)</h3>
                <p className="text-slate-300 text-sm mb-4">Paste your Stellar/Soroban secret key. This is kept in memory only for this session.</p>
                <input value={secret} onChange={e=>setSecret(e.target.value)} className="w-full p-2 rounded bg-slate-800 text-sm mb-3" />
                <div className="flex justify-end space-x-2">
                  <button className="px-3 py-2 rounded bg-slate-700" onClick={()=>setOpen(false)}>Cancel</button>
                  <button className="px-3 py-2 rounded bg-emerald-500 text-black" onClick={async()=>{ await wallet.connectWithSecret(secret); setOpen(false)}}>Import</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
