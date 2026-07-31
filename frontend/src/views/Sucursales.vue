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
              <nueva-sucursal-modal @sucursal-creada="fetchSucursales"/>
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
                  <span class="mr-2">¿Borrar {{(item as SucursalTData).nombre}}?</span>
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
                    @click="borrarSucursal({...item as SucursalTData})"
                  >
                    Si
                  </v-btn>
                </div>
              </template>
            </v-tooltip>
          </v-card>
      </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts" setup>
import { onMounted, ref, defineComponent } from 'vue';
import { getApiBase, safeFetchJson, isDarkMode } from '../composables/main.compose';
import NuevaSucursalModal from './Sucursales/NuevaSucursalModal.vue'
import { SucursalTData } from '../../../shared/models/Sucursal.ts';
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
    key: 'index'
  },
  {
    title: 'Nombre',
    align: 'start',
    sortable: true,
    key: 'nombre'
  },
   {
    title: 'Tipo',
    align: 'start',
    sortable: true,
    key: 'tipo'
  },
  {
    title: 'Dirección',
    align: 'start',
    sortable: true,
    key: 'direccion'
  },
  {
    title: 'Telefono',
    align: 'start',
    sortable: true,
    key: 'telefono'
  },
  {
    title: 'Email',
    align: 'start',
    sortable: true,
    key: 'email'
  },
  {
    title: 'Acciones admin',
    align: 'start',
    sortable: false,
    key: 'actions'
  }
] as const

const fetchSucursales = async () => {
  const apiBase = getApiBase()
  console.log(`Connecting to backend at ${apiBase}`)
  try {
    const data = await safeFetchJson(apiBase + '/sucursales')
    sucursales.value = data
  } catch (err: any) {
    console.log(`Failed to connect: ${err.message || err}`);
  }
}

const borrarSucursal = async (sucursal: SucursalTData) => {
  try { 
    const response: Response = await fetch(`${getApiBase()}/sucursales/${sucursal.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'aplication/json',
        // Add 'Authorization': 'Bearer token' here if needed
      }
    });
    if(response.ok) {
      const data = await response.json();
      console.log('Server response: ', data);
      fetchSucursales()
    } else {
      console.error(`HTTP error! status: ${response.status}`);
    }  
    
   } catch (error) {
    console.error('Request failed:', error);
   }
}

onMounted(async ()=> {
  fetchSucursales();
})

</script>