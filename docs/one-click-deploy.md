### One-click deploy (optional)

This workspace includes a GitHub Actions workflow template that can deploy the compiled WASM to Soroban testnet using a repository secret. This is gated and will not run unless you create a repository secret named SOROBAN_DEPLOY_KEY (the private key) and manually trigger the workflow.

Steps to enable:
1. Add a repo secret SOROBAN_DEPLOY_KEY with the deployer's secret key (keep this safe!)
2. Go to the Actions tab and run the "Deploy guestbook" workflow manually.

The workflow is intentionally opt-in for safety. If you prefer not to enable it, use the CLI commands shown in the UI.
