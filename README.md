# Soroban Guestbook + Next.js

A lightweight developer playground for building, deploying, and interacting with Soroban smart contracts from a polished Next.js + Tailwind + TypeScript interface.

This project provides:

- A sample Soroban guestbook contract written in Rust
- A local development flow for compiling the contract to WASM
- A Next.js frontend for inspecting a WASM artifact and preparing deployment steps
- A simple wallet import flow for testing contract interaction in a browser
- Local message caching and optimistic UI behavior to make dev workflows smoother

## Why this project exists

The goal is to make Soroban development feel approachable for early-stage builders and contributors. Instead of forcing everyone into a full production wallet setup immediately, the app keeps the experience focused on:

- building a contract
- understanding the compiled artifact
- preparing deployment commands
- loading a deployed contract ID
- sending a simple write transaction

## Project structure

```text
.
├── components/              # Reusable UI components
├── contracts/
│   └── guestbook/          # Rust Soroban guestbook contract
├── lib/                    # Soroban utilities and helpers
├── pages/                  # Next.js pages and API routes
├── styles/                 # Global styles
├── .gitignore
├── next.config.js
├── package.json
├── README.md
├── PROJECT_OVERVIEW.md
├── tailwind.config.js
├── tsconfig.json
└── ...
```

## Tech stack

- Next.js 13
- React 18
- TypeScript
- Tailwind CSS
- Rust + Soroban SDK
- soroban-cli for deployment

## Prerequisites

Before running this project, make sure you have:

- Node.js 18+ and npm
- Rust installed
- The wasm target for Rust:

```bash
rustup target add wasm32-unknown-unknown
```

- soroban-cli installed and configured for a network such as testnet

## Quick start

### 1) Install frontend dependencies

```bash
npm install
```

### 2) Build the guestbook contract

```bash
cd contracts/guestbook
cargo build --target wasm32-unknown-unknown --release
```

The compiled artifact will be generated at:

```text
contracts/guestbook/target/wasm32-unknown-unknown/release/guestbook.wasm
```

### 3) Run the app

From the repo root:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Using the app

### Upload a WASM

Use the upload panel to load a compiled `.wasm` file. This gives you a quick way to inspect your artifact and prepare deployment steps.

### Deploy a contract

The app includes an opt-in deploy flow, but it is intentionally simple and primarily designed to support a developer-friendly CLI workflow.

Example deploy command:

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/guestbook.wasm \
  --network testnet
```

After deployment, paste the returned contract ID into the UI and use it for reads and writes.

### Connect a wallet key

The app includes a basic dev-key import flow:

- paste a Stellar/Soroban secret key
- derive the public key in memory for the session
- use it to simulate the transaction flow

This is useful for local demos and experimentation, but it is not a production wallet implementation.

## Optional environment variables

The app reads the Soroban RPC endpoint from:

```bash
NEXT_PUBLIC_SOROBAN_RPC_URL
```

Example:

```bash
NEXT_PUBLIC_SOROBAN_RPC_URL=https://rpc.testnet.soroban.stellar.org
```

## Contract behavior

The included contract is intentionally minimal:

- `write(author, text)` stores a message
- `get_count()` returns the total count
- `get_message(idx)` reads one message by index

This makes it a good base for experimenting with contract storage, transaction flow, and frontend integration.

## Repository notes

- The app keeps wallet access optional and deliberately lightweight for local development.
- Signing and true on-chain deployment are still best handled through soroban-cli when needed.
- The frontend focuses on ergonomics: upload, inspect, copy commands, and interact with a running contract.

## Recommended next improvements

This project is already a solid starting point. The next meaningful improvements could include:

- a real Soroban wallet integration (browser wallet or extension support)
- better contract argument parsing and validation
- a richer contract explorer UI
- environment-based network switching (testnet vs futurenet)
- deployment artifact handling and contract verification
- richer docs for `write`, `get_count`, and `get_message`
- automated tests for the frontend and contract logic

## Contributing

Feel free to open issues or suggest improvements. This project is especially useful as a learning and prototyping environment for Soroban workflows.

## License

This repo does not currently declare a license in the root files. If you plan to share or distribute it publicly, consider adding one such as MIT or Apache 2.0.
