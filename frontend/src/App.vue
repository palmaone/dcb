<script setup lang="ts">
import { ref, onMounted } from 'vue'

const backendStatus = ref('Connecting...')
const dbStatus = ref('Connecting...')

function getApiBase(): string {
  const envUrl = (import.meta as any).env?.VITE_API_URL?.trim()
  if (envUrl) {
    return envUrl.replace(/\/+$/, '')
  }

  if ((import.meta as any).env?.DEV) {
    return '/api'
  }

  throw new Error('VITE_API_URL is not defined. Set the public backend URL for production deployments.')
}

async function safeFetchJson(url: string) {
  const res = await fetch(url)
  const contentType = res.headers.get('content-type') || ''
  if (!res.ok || !contentType.includes('application/json')) {
    const text = await res.text()
    if (text.trim().startsWith('<')) {
      throw new Error(`Received HTML response instead of JSON from ${url}. Check the frontend API configuration.`)
    }
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 100)}`)
  }
  return res.json()
}

onMounted(async () => {
  const apiBase = getApiBase()
  console.log(`Connecting to backend at ${apiBase}`)
  try {
    const data = await safeFetchJson(apiBase + '/')
    backendStatus.value = `Connected to ${data.service} (${data.status})`
  } catch (err: any) {
    backendStatus.value = `Failed to connect: ${err.message || err}`
  }

  try {
    const data = await safeFetchJson(apiBase + '/db-test')
    dbStatus.value = `Database Status: ${data.status} (Server Time: ${data.time ? JSON.stringify(data.time) : 'N/A'})`
  } catch (err: any) {
    dbStatus.value = `Failed database connection check: ${err.message || err}`
  }
})
</script>

<template>
  <div class="container">
    <h1>Hono + Deno + Vue Boilerplate</h1>
    <div class="status-card">
      <h3>Backend status:</h3>
      <p>{{ backendStatus }}</p>
    </div>
    <div class="status-card">
      <h3>Database status:</h3>
      <p>{{ dbStatus }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}
.status-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background-color: #fafafa;
}
</style>
