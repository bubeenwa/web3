import React from 'react'

export default function ContractInspector({ wasmInfo, contractId, onContractIdChange }: { wasmInfo: {name:string,size:number,bytes?:Uint8Array}|null, contractId: string, onContractIdChange: (v:string)=>void }){
  return (
    <div className="bg-gradient-to-br from-slate-900/40 to-slate-800/20 p-6 rounded-xl border border-slate-700 shadow-xl">
      <h3 className="text-lg font-semibold mb-2">Contract Inspector & Deploy</h3>
      {wasmInfo ? (
        <div>
          <p className="text-slate-300">Loaded: <span className="font-medium">{wasmInfo.name}</span> — {wasmInfo.size} bytes</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded">
              <h4 className="text-sm font-semibold mb-2">CLI Deploy</h4>
              <p className="text-xs text-slate-300 mb-2">Copy these commands to build & deploy using soroban-cli</p>
              <pre className="bg-slate-900 p-3 rounded text-xs overflow-auto"># build (from contract dir)
cargo build --target wasm32-unknown-unknown --release

# deploy using soroban-cli (example testnet)
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/{wasm}

# after deploy note the contract id and paste it below
</pre>
            </div>

            <div className="bg-slate-800 p-4 rounded">
              <h4 className="text-sm font-semibold mb-2">Connect</h4>
              <p className="text-xs text-slate-300 mb-2">Enter a deployed contract ID to load it in the UI</p>
              <input value={contractId} onChange={e=>onContractIdChange(e.target.value)} placeholder="Contract ID (deployed)" className="w-full p-2 rounded bg-slate-900 text-sm" />

              <div className="mt-4">
                <button className="px-4 py-2 rounded bg-emerald-500 text-black font-semibold">Load</button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-slate-300 text-sm">Want the contract source? It's included in <code>contracts/guestbook</code>.</p>
          </div>
        </div>
      ) : (
        <div className="text-slate-300">No WASM loaded. Build the included contract or upload a compiled wasm to get CLI commands and deploy pointers.</div>
      )}
    </div>
  )
}
