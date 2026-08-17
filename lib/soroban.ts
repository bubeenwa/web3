const DEFAULT_RPC = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://rpc.testnet.soroban.stellar.org'

// Minimal helpers to interact with the Guestbook contract. These functions are intentionally
// forgiving: they attempt RPC calls, but also provide developer-friendly fallbacks.

export async function getCount(contractId: string): Promise<number>{
  // Best-effort: attempt a read via the /contract/read endpoint (RPCs vary). If that fails, return 0.
  try{
    const res = await fetch(`${DEFAULT_RPC}/contracts/${contractId}/count`)
    if(!res.ok) throw new Error('non-200')
    const data = await res.json()
    // this is optimistic parsing
    return Number(data?.count || 0)
  }catch(e){
    return 0
  }
}


export async function fetchMessages(contractId: string): Promise<{ idx:number, text:string }[]> {
  // try a simple RPC path that many gateways provide, otherwise return local cache
  try{
    const url = `${DEFAULT_RPC}/contracts/${contractId}/messages`
    const res = await fetch(url)
    if(res.ok){
      const json = await res.json()
      // expect json to be array of {idx, text}
      if(Array.isArray(json)) return json.map((x:any)=>({ idx: Number(x.idx), text: String(x.text) }))
    }
  }catch(e){
    // continue to fallback
  }

  // Fallback: localStorage keyed by contractId
  try{
    if(typeof window !== 'undefined'){
      const raw = localStorage.getItem(`guestbook:${contractId}:messages`)
      if(raw) return JSON.parse(raw)
    }
  }catch(e){}

  return []
}

// simulateInvoke builds a lightweight object that represents a transaction to be signed.
// This intentionally keeps the details abstract so the wallet adapter can sign the "payload".
export async function simulateInvoke(contractId: string, fromPublic: string, text: string){
  // Return a simple payload with fields the wallet adapter knows how to sign
  return {
    network: 'testnet',
    contractId,
    from: fromPublic,
    method: 'write',
    args: [text],
    // timestamp so signatures differ
    ts: Date.now(),
  }
}

// submitTransaction tries to use the wallet.sign to produce a signature and then POST to the RPC
export async function submitTransaction(tx:any, wallet:any){
  // tx is the object returned by simulateInvoke
  if(!wallet || !wallet.sign) throw new Error('no wallet')
  const payload = new TextEncoder().encode(JSON.stringify(tx))
  const sig = await wallet.sign(payload)

  // attempt to submit to an optimistic RPC endpoint
  try{
    const res = await fetch(`${DEFAULT_RPC}/tx`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ tx, sig: Array.from(sig) })
    })
    if(res.ok){
      const json = await res.json()
      // optimistic: if tx succeeded, store message in local cache so UI shows it immediately
      if(typeof window !== 'undefined'){
        const key = `guestbook:${tx.contractId}:messages`
        const prev_raw = localStorage.getItem(key)
        const prev = prev_raw ? JSON.parse(prev_raw) : []
        prev.unshift({ idx: prev.length, text: tx.args[0] })
        localStorage.setItem(key, JSON.stringify(prev))
      }
      return json
    }
    throw new Error('rpc failed')
  }catch(e){
    // As a best-effort fallback, store locally to give a nice dev UX
    if(typeof window !== 'undefined'){
      const key = `guestbook:${tx.contractId}:messages`
      const prev_raw = localStorage.getItem(key)
      const prev = prev_raw ? JSON.parse(prev_raw) : []
      prev.unshift({ idx: prev.length, text: tx.args[0] })
      localStorage.setItem(key, JSON.stringify(prev))
    }
    return { ok: false, error: String(e) }
  }
}
