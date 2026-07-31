<template>
  <div>
    <v-data-table
      :items="pedidos" 
      :headers="tbl_headers"
      no-data-text="No hay pedidos pendientes para mostrar."
    >
      <template #top>
        <v-toolbar flat>
            <v-toolbar-title>Pedidos Pendientes</v-toolbar-title>
            <v-spacer />
            <nuevo-pedido-modal />
        </v-toolbar>
      </template>
       <template #[`item.actions`]="{ item }">
          <v-card rounded="10" :color="isDarkMode() ? 'grey-darken-3' : 'grey-lighten-3'" variant="elevated" max-width="fit-content">
            
            <v-btn icon="mdi-pencil" variant="plain" size="small"></v-btn>
            <v-tooltip color="default" :open-on-hover="false" open-on-click interactive>
              <template #activator="{ props: activatorProps }">
                <v-btn
                  icon="mdi-delete"
                  variant="plain"
                  size="small"
                  color="red"
                  v-bind="activatorProps"
                ></v-btn>
              </template>
              <template #default="{isActive}">
                <div>
                  <span class="mr-2">¿Borrar pedido {{(item as PedidoTData).folio}}?</span>
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    class="mr-2"
                    @click="isActive.value = false"
                  >
                    No
                  </v-btn>
                  <v-btn
                    size="x-small"
                    variant="outlined"
                    @click="borrarPedido({...item as PedidoTData})"
                  >
                    Si
                  </v-btn>
                </div>
              </template>
            </v-tooltip>
          </v-card>
         </template>
    </v-data-table>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import NuevoPedidoModal from '../../components/NuevoPedido/NuevoPedidoModal.vue'
import { getApiBase, isDarkMode, safeFetchJson } from '../../composables/main.compose.ts';
import { PedidoTData } from '../../../../shared/models/Pedido.ts';

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
  },
  {
    title: 'Acciones admin',
    align: 'start',
    sortable: false,
    key: 'actions'
  }
] as const

const borrarPedido = () => {

}
onMounted(async ()=> {
  const apiBase = getApiBase()
    try {
      const data = await safeFetchJson(apiBase + '/pedidos/pendientes')
      console.log("data", data);
      pedidos.value = data
    } catch (err: any) {
      console.log(`Failed to connect: ${err.message || err}`);
    }
})

</script>