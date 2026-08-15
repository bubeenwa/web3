import Head from 'next/head'
import { useState } from 'react'
import Header from '../components/Header'
import UploadCard from '../components/UploadCard'
import ContractInspector from '../components/ContractInspector'

export default function Home() {
  const [wasmInfo, setWasmInfo] = useState<{ name: string; size: number; bytes?: Uint8Array } | null>(null)
  const [contractId, setContractId] = useState<string>('')

  return (
    <div>
      <Head>
        <title>Soroban Guestbook — Dev Playground</title>
        <meta name="description" content="Build & deploy Soroban contracts with confidence." />
      </Head>

      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <UploadCard onLoaded={setWasmInfo} />
          <div className="lg:col-span-2">
            <ContractInspector wasmInfo={wasmInfo} contractId={contractId} onContractIdChange={setContractId} />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Guestbook contract (included)</h2>
          <p className="text-slate-300">A small Rust contract that stores messages on-chain. Build it with <code>cargo build --target wasm32-unknown-unknown --release</code>.</p>
        </section>
      </main>
    </div>
  )
}
