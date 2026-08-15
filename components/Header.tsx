import React from 'react'

export default function Header(){
  return (
    <header className="border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-extrabold">Soroban Guestbook</h1>
          <p className="text-slate-300 text-sm mt-1">Beautiful dev tooling for Soroban smart contracts</p>
        </div>
        <nav>
          <a className="text-slate-300 hover:text-white" href="#">Docs</a>
        </nav>
      </div>
    </header>
  )
}
