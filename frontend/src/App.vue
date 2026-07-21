<script setup lang="ts">
import { ref, onMounted } from 'vue'

const backendStatus = ref('Connecting...')
const dbStatus = ref('Connecting...')

onMounted(async () => {
  try {
    // Cast import.meta to any to access env in TypeScript files
    const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'
    const res = await fetch(apiBase)
    const data = await res.json()
    backendStatus.value = `Connected to ${data.service} (${data.status})`
  } catch (err) {
    backendStatus.value = `Failed to connect: ${err}`
  }

  try {
    const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'
    const res = await fetch(apiBase + '/db-test')
    const data = await res.json()
    dbStatus.value = `Database Status: ${data.status} (Server Time: ${data.time ? JSON.stringify(data.time) : 'N/A'})`
  } catch (err) {
    dbStatus.value = `Failed database connection check: ${err}`
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
