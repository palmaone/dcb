<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h1>Bienvenido</h1>
        <v-col>
          <v-row cols="12">
            <h5>{{ dbStatus }}</h5>
          </v-row>
          <v-row cols="12">
            <h5>{{ backendStatus }}</h5>
          </v-row>
        </v-col>
      </v-card-title>
    </v-card>

  </v-container>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getApiBase, safeFetchJson } from '../composables/main.compose'

const backendStatus = ref('Connecting...')
const dbStatus = ref('Connecting...')
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