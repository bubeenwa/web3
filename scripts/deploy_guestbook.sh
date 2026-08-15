#!/usr/bin/env bash
# Build & deploy helper for the guestbook contract.
# Requires: soroban-cli, cargo, rust target wasm32-unknown-unknown

set -euo pipefail

cd contracts/guestbook

echo "Building guestbook contract (release wasm)..."
RUSTFLAGS="-C link-arg=-s" cargo build --target wasm32-unknown-unknown --release

WASM_PATH="target/wasm32-unknown-unknown/release/guestbook.wasm"
if [ ! -f "$WASM_PATH" ]; then
  echo "WASM not found at $WASM_PATH"
  exit 1
fi

echo "To deploy the contract with soroban-cli (testnet), run:"
echo "  soroban contract deploy --wasm $WASM_PATH --network testnet"

echo "After deploy, note the contract ID and paste it into the frontend to interact."
