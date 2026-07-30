<template>
  <v-container fluid>
    <v-card>
      <v-data-table :items="clientes" :headers="tbl_headers">
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Clientes</v-toolbar-title>
            <v-spacer />
            <nuevo-cliente-modal @cliente-creado="fetchClientes"/>
          </v-toolbar>
        </template>
         <template #[`item.actions`]="{ item }">
          <v-card rounded="10" color="grey-lighten-3" variant="elevated" max-width="fit-content">
            <v-tooltip location="left top">
              <template #activator="{ props: activatorProps }">                  
                <v-btn
                icon="mdi-note-edit"
                :color="(item as ClienteTData).notas ? 'orange':'default'"
                variant="plain"
                size="small"
                v-bind="(item as ClienteTData).notas ? activatorProps : null"
                ></v-btn>
              </template>
              <template #default>
                <div>
                  <span v-if="(item as ClienteTData).notas">{{ (item as ClienteTData).notas }}</span>
                  <span v-else>...</span>
                </div>
              </template>
            </v-tooltip>
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
                  <span class="mr-2">¿Borrar {{(item as ClienteTData).nombre_completo}}?</span>
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
                    @click="borrarCliente({...item as ClienteTData})"
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
import { getApiBase, safeFetchJson } from '../composables/main.compose';
import NuevoClienteModal from './Clientes/NuevoClienteModal.vue';

import { ClienteTData } from '../../../shared/models/Cliente';
defineComponent({
  name: "Clientes",
  components: {
    NuevoClienteModal
  }
})
const apiBase = getApiBase()
const clientes = ref([])
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
    key: 'nombre_completo',
  },
  {
    title: 'Domicilio',
    align: 'start',
    sortable: true,
    key: 'domicilio',
  },
  {
    title: 'Colonia',
    align: 'start',
    sortable: true,
    key: 'colonia',
  },
  {
    title: 'Telefono',
    align: 'start',
    sortable: true,
    key: 'telefono',
  },
  {
    title: 'Email',
    align: 'start',
    sortable: true,
    key: 'email',
  },
  {
    title: 'Entre calles',
    align: 'start',
    sortable: true,
    key: 'entre_calles',
  },
  {
    title: 'Persona confianza',
    align: 'start',
    sortable: true,
    key: 'persona_confianza',
  },
  {
    title: 'Acciones admin',
    align: 'start',
    sortable: false,
    key: 'actions'
  }
] as const

const fetchClientes = async () => {
  console.log(`Connecting to backend at ${apiBase}`)
  try {
    const data = await safeFetchJson(apiBase + '/clientes')
    clientes.value = data
  } catch (err: any) {
    console.log(`Failed to connect: ${err.message || err}`);
  }
}

const borrarCliente = async (item: ClienteTData) => {
  console.log("item", item);
  
  try { 
    const response: Response = await fetch(`${apiBase}/clientes/${item.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'aplication/json',
        // Add 'Authorization': 'Bearer token' here if needed
      }
    });
    if(response.ok) {
      const data = await response.json();
      console.log('Server response: ', data);
      fetchClientes()
    } else {
      console.error(`HTTP error! status: ${response.status}`);
    }  
    
   } catch (error) {
    console.error('Request failed:', error);
   }
} 
onMounted(async () => {
  fetchClientes()
})

</script>