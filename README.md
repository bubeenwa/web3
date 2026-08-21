# Soroban Guestbook + Next.js 

This repository contains a developer-focused web app that helps build, deploy, and interact with Soroban smart contracts using a beautiful Next.js + Tailwind + TypeScript UI.

What you'll find here:
- A soroban book
- A simple Soroban "guestbook" contract (Rust) that stores short messages on-chain.
- Scripts to build and deploy the contract using soroban-cli (targeting testnet by default).
- A polished Next.js (TypeScript) frontend that helps you prepare deployments, upload a WASM, and interact with the contract (UI-first experience for devs).

Quick start

1. Install frontend deps:

   npm install

2. Build the contract (requires Rust + wasm target):

 //Build guestbook 
 cd contracts/guestbook
   cargo build --target wasm32-unknown-unknown --release

   The compiled wasm file will be at: target/wasm32-unknown-unknown/release/guestbook.wasm

3. Deploy with soroban-cli (example for testnet):

   # ensure soroban-cli is installed and configured
   soroban contract deploy --wasm target/wasm32-unknown-unknown/release/guestbook.wasm --network testnet

4. Run the frontend:

   npm run dev

Open http://localhost:3000 — the frontend helps you load your WASM, craft deploy commands, and interact with a contract.

Notes

- This project intentionally leaves signing/deploying to soroban-cli to keep wallet integration optional and secure. The frontend focuses on developer ergonomics: upload, inspect, copy CLI commands, and interact via RPC when you provide a contract ID.
- See /contracts for the Rust guestbook contract source.
