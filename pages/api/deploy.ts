// pages/api/deploy.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import fetch from 'node-fetch'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')

  // If no deploy token is configured, respond with a message so the UI can fallback to CLI.
  const token = process.env.GITHUB_DEPLOY_TOKEN
  if (!token) {
    return res.status(501).json({ error: 'One-click deploy not enabled on this instance. Use CLI commands.' })
  }

  const form = formidable({ multiples: false })
  try {
    const parsed = await new Promise<{ files: any; fields: any }>((resolve, reject) =>
      form.parse(req as any, (err, fields, files) => (err ? reject(err) : resolve({ files, fields })))
    )

    const wasmFile = parsed.files?.wasm
    if (!wasmFile) return res.status(400).json({ message: 'missing wasm file' })

    // Option A: store the wasm as artifact or push to an external deploy service.
    // For now we'll trigger a workflow_dispatch and include a small metadata payload.
    const workflow_id = 'deploy-guestbook.yml' // ensure this workflow exists in .github/workflows
    const owner = 'bubeenwa'
    const repo = 'web3'
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`

    const body = {
      ref: 'main',
      inputs: {
        note: 'Deployed via one-click UI',
      },
    }

    const r = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(body),
    })

    if (r.status === 204) {
      return res.status(200).json({ message: 'Workflow dispatched' })
    }

    const text = await r.text()
    return res.status(500).json({ message: 'Failed to dispatch', detail: text })
  } catch (e: any) {
    return res.status(500).json({ message: String(e?.message || e) })
  }
}
