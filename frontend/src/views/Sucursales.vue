<template>
  <v-container fluid>
    <v-card>
      <v-data-table 
        :items="sucursales"
        :headers="tbl_headers"
      >
        <template #top>
          <v-toolbar flat>
              <v-toolbar-title>Sucursales</v-toolbar-title>
              <v-spacer />
              <nueva-sucursal-modal />
          </v-toolbar>
      </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts" setup>
import { onMounted, ref, defineComponent } from 'vue';
import { getApiBase, safeFetchJson } from '../composables/main.compose';
import NuevaSucursalModal from './Sucursales/NuevaSucursalModal.vue'
defineComponent({
  name:"Sucursales",
  components: {
    NuevaSucursalModal
  }
})
const sucursales = ref([])
const tbl_headers = [
  {
    title: 'Nº',
    align: 'end',
    sortable: true,
    key: 'index',
    width: '1%'
  },
  {
    title: 'Nombre',
    align: 'start',
    sortable: true,
    key: 'nombre',
    width: '1%'
  },
  {
    title: 'Dirección',
    align: 'start',
    sortable: true,
    key: 'direccion',
    width: '1%'
  },
  {
    title: 'Telefono',
    align: 'start',
    sortable: true,
    key: 'telefono',
    width: '1%'
  },
  {
    title: 'Email',
    align: 'start',
    sortable: true,
    key: 'email',
    width: '1%'
  }
]

onMounted(async ()=> {
  const apiBase = getApiBase()
  console.log(`Connecting to backend at ${apiBase}`)
  try {
    const data = await safeFetchJson(apiBase + '/sucursales')
    sucursales.value = data
  } catch (err: any) {
    console.log(`Failed to connect: ${err.message || err}`);
  }
})

</script>