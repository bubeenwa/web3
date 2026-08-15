import React, { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import UploadCard from '../components/UploadCard'
import ContractInspector from '../components/ContractInspector'
import DeployPanel from '../components/DeployPanel'
import ConnectButton from '../components/ConnectButton'
import WriteMessage from '../components/WriteMessage'
import MessageList from '../components/MessageList'

export default function Home(){
  const [wasmInfo, setWasmInfo] = useState(null as any)
  const [contractId, setContractId] = useState('')
  const [refresh, setRefresh] = useState(0)

  return (
    <div>
      <Head>
        <title>Soroban Guestbook — Interactive</title>
      </Head>

      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold">Guestbook</h2>
          <ConnectButton />
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <UploadCard onLoaded={setWasmInfo} />
            <ContractInspector wasmInfo={wasmInfo} contractId={contractId} onContractIdChange={setContractId} />
            <div className="mt-4">
              <DeployPanel wasmInfo={wasmInfo} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/40 p-6 rounded-xl">
              <WriteMessage contractId={contractId} onDone={()=>setRefresh(v=>v+1)} />
            </div>

            <div className="bg-slate-900/20 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Messages</h3>
              <MessageList contractId={contractId} refreshSignal={refresh} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
