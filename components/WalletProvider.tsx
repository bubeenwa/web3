import React, { createContext, useContext, useEffect, useState } from 'react'

type Wallet = {
  publicKey: string | null
  connectWithSecret: (secret: string) => Promise<void>
  disconnect: () => void
  sign: (message: Uint8Array) => Promise<Uint8Array>
}

const WalletContext = createContext<Wallet | null>(null)

export function useWallet(){
  const ctx = useContext(WalletContext)
  if(!ctx) throw new Error('useWallet must be used inside WalletProvider')
  return ctx
}

// A very small dev-key adapter: import secret key (Stellar style) and derive public key.
// NOTE: This keeps the key in memory only (session). Do NOT use in production.
export function WalletProvider({ children }: { children: React.ReactNode }){
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [secretKey, setSecretKey] = useState<string | null>(null)

  useEffect(()=>{
    if (typeof window !== 'undefined'){
      // For convenience, restore session-scoped key from memory (none persisted)
    }
  }, [])

  async function connectWithSecret(secret: string){
    // The secret format for soroban/stellar is like 'S...'. We'll store it in memory only.
    setSecretKey(secret)
    try{
      // Attempt to derive public key using soroban-client if available
      // Keep this dynamic-import to avoid server-side issues
      const sc = await import('soroban-client')
      if(sc && sc.Keypair){
        const kp = sc.Keypair.fromSecret(secret)
        setPublicKey(kp.publicKey())
      } else {
        // fallback: store the secret as the "publicKey" for dev flows
        setPublicKey(secret.slice(0,8))
      }
    }catch(e){
      // If soroban-client not available at runtime, derive naively
      setPublicKey(secret.slice(0,8))
    }
  }

  async function disconnect(){
    setSecretKey(null)
    setPublicKey(null)
  }

  async function sign(message: Uint8Array){
    if(!secretKey) throw new Error('no key available')
    // Use soroban-client Keypair to sign a message if possible
    try{
      const sc = await import('soroban-client')
      if(sc && sc.Keypair){
        const kp = sc.Keypair.fromSecret(secretKey)
        // sign returns a Buffer/Uint8Array depending on implementation
        const sig = kp.sign(message)
        return sig
      }
    }catch(e){
      // fallback: return the message (NOT A REAL SIGNATURE)
      return message
    }
    return message
  }

  const value: Wallet = {
    publicKey,
    connectWithSecret,
    disconnect,
    sign,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
