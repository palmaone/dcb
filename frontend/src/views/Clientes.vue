<template>
  <v-container fluid>
    <v-card>
      <v-data-table 
        :items="usuarios"
        :headers="tbl_headers"
      >
        <template #top>
          <v-toolbar flat>
              <v-toolbar-title>Usuarios</v-toolbar-title>
              <v-spacer />
              <nuevo-cliente-modal />
          </v-toolbar>
      </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts" setup>
import { onMounted, ref, defineComponent } from 'vue';
import { getApiBase, safeFetchJson } from '../composables/main.compose';
import NuevoClienteModal from './Clientes/NuevoClienteModal.vue';
defineComponent({
  name:"Clientes",
  components: {
    NuevoClienteModal
  }
})
const usuarios = ref([])
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
    width: '1%'
  },
  {
    title: 'Domicilio',
    align: 'start',
    sortable: true,
    key: 'domicilio',
    width: '1%'
  },
  {
    title: 'Colonia',
    align: 'start',
    sortable: true,
    key: 'colonia',
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
  },
   {
    title: 'Entre calles',
    align: 'start',
    sortable: true,
    key: 'entre_calles',
    width: '1%'
  },
   {
    title: 'Persona confianza',
    align: 'start',
    sortable: true,
    key: 'persona_confianza',
    width: '1%'
  },
]

onMounted(async ()=> {
  const apiBase = getApiBase()
  console.log(`Connecting to backend at ${apiBase}`)
  try {
    const data = await safeFetchJson(apiBase + '/clientes')
    usuarios.value = data
  } catch (err: any) {
    console.log(`Failed to connect: ${err.message || err}`);
  }
})

</script>