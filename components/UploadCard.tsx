import React from 'react'

export default function UploadCard({ onLoaded }: { onLoaded: (info: {name:string,size:number,bytes?:Uint8Array}|null)=>void }){
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if(!f){ onLoaded(null); return }
    const buffer = new Uint8Array(await f.arrayBuffer())
    onLoaded({ name: f.name, size: f.size, bytes: buffer })
  }

  return (
    <div className="bg-slate-900/40 p-6 rounded-xl shadow-lg border border-slate-800">
      <h3 className="text-lg font-semibold mb-2">Upload WASM</h3>
      <p className="text-slate-300 text-sm mb-4">Upload a compiled contract .wasm to inspect and get deploy commands.</p>

      <input type="file" accept=".wasm" onChange={handleFile} className="block text-sm text-slate-200" />

      <div className="mt-6 text-slate-300 text-sm">
        <p className="mb-2">Or build included guestbook contract locally:</p>
        <pre className="bg-slate-800 p-3 rounded text-xs">cd contracts/guestbook
cargo build --target wasm32-unknown-unknown --release</pre>
      </div>
    </div>
  )
}
