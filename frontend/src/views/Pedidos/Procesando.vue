<template>
  <div>
    <v-data-table :items="pedidos" :headers="tbl_headers" no-data-text="No hay pedidos en proceso para mostrar.">
      <template #top>
        <v-toolbar flat>
            <v-toolbar-title>Pedidos en proceso</v-toolbar-title>
            <v-spacer />
            <v-btn variant="tonal" color="deep-orange-accent-4" icon="mdi-plus" @click="openNewOrderModal"></v-btn>
        </v-toolbar>
      </template>
    </v-data-table>
  </div>
  <nuevo-pedido-modal />
</template>
<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import { uiStore } from '../../stores/ui.store.ts'
import NuevoPedidoModal from '../../components/NuevoPedido/NuevoPedidoModal.vue'
import { getApiBase, safeFetchJson } from '../../composables/main.compose.ts';
import { PedidoTData } from '../../../../shared/models/Pedido.ts';

const { showNewOrderModal } = uiStore()
defineComponent({
  name: 'PedidosPendientes',
  components: {
    NuevoPedidoModal
  }
})
const pedidos = ref<PedidoTData[]>([])
const tbl_headers = [
  {
    title: 'Nº',
    align: 'end',
    sortable: true,
    key: 'index',
    width: '1%'
  },
  {
    title: 'Folio',
    align: 'start',
    sortable: true,
    key: 'folio', 
  },
  {
    title: 'Status',
    align: 'start',
    sortable: true,
    key: 'status', 
  },
  {
    title: 'Cliente',
    align: 'start',
    sortable: true,
    key: 'nombre_cliente', 
  },
  {
    title: 'Usuario',
    align: 'start',
    sortable: true,
    key: 'nombre_usuario', 
  },
  {
    title: 'Quien recibe',
    align: 'start',
    sortable: true,
    key: 'quien_recibe', 
  }
]

function openNewOrderModal() {
  showNewOrderModal(true)
}

onMounted(async ()=> {
  const apiBase = getApiBase()
     console.log(`Connecting to backend at ${apiBase}`)
    try {
      const data = await safeFetchJson(apiBase + '/pedidos/procesando')
      console.log("data", data);
      pedidos.value = data
    } catch (err: any) {
      console.log(`Failed to connect: ${err.message || err}`);
    }
})

</script>