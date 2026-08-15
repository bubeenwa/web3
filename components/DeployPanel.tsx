import React, { useState } from 'react'

export default function DeployPanel({ wasmInfo }: { wasmInfo: { name: string; size: number; bytes?: Uint8Array } | null }) {
  const [deploying, setDeploying] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [contractId, setContractId] = useState('')

  async function oneClickDeploy(wasm: Uint8Array) {
    setDeploying(true)
    setMsg(null)
    try {
      const form = new FormData()
      const blob = new Blob([wasm], { type: 'application/wasm' })
      form.append('wasm', blob, 'contract.wasm')

      const res = await fetch('/api/deploy', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || 'deploy failed')
      setContractId(json.contract_id || '')
      setMsg('Deployed — contract ID returned')
    } catch (e: any) {
      setMsg(String(e?.message || e))
    } finally {
      setDeploying(false)
    }
  }

  return (
    <div className="bg-slate-800 p-4 rounded">
      <h4 className="font-semibold">Deploy</h4>

      {wasmInfo ? (
        <>
          <p className="text-sm text-slate-300">WASM: <strong>{wasmInfo.name}</strong> — {wasmInfo.size} bytes</p>

          <div className="mt-3 flex space-x-2">
            <button
              className="px-3 py-2 rounded bg-indigo-500 text-white"
              onClick={() => {
                if (!wasmInfo?.bytes) { setMsg('Please upload a .wasm first'); return }
                oneClickDeploy(wasmInfo.bytes)
              }}
              disabled={deploying}
            >
              {deploying ? 'Deploying…' : 'One‑click Deploy (opt‑in)'}
            </button>

            <button
              className="px-3 py-2 rounded bg-slate-700 text-slate-200"
              onClick={() => {
                navigator.clipboard.writeText(
`# build (from contract dir)
RUSTFLAGS="-C link-arg=-s" cargo build --target wasm32-unknown-unknown --release

# deploy (example)
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/<your-wasm>.wasm --network testnet`
                )
                setMsg('CLI commands copied to clipboard')
              }}
            >
              Copy CLI commands
            </button>
          </div>

          {contractId && (
            <div className="mt-3">
              <div className="text-sm text-slate-300">Contract ID:</div>
              <div className="mt-1 bg-slate-900 p-2 rounded text-sm font-mono">{contractId}</div>
            </div>
          )}

          {msg && <div className="mt-3 text-sm text-amber-300">{msg}</div>}
        </>
      ) : (
        <div className="text-slate-400">Upload a compiled wasm to enable deploy options.</div>
      )}
    </div>
  )
}
