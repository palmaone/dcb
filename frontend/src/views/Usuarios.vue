<template>
  <v-container>
    <v-card>
      <v-data-table 
        :items="usuarios"
        :headers="tbl_headers"
      >
        <template #top>
          <v-toolbar flat>
              <v-toolbar-title>Usuarios</v-toolbar-title>
              <v-spacer />
              <nuevo-usuario-modal @usuario-creado="fetchUsuarios"/>
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
                  <span class="mr-2">¿Borrar {{(item as UsuarioTData).nombre_completo}}?</span>
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
                    @click="borrarUsuario({...item as UsuarioTData})"
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
import { getApiBase, isDarkMode, safeFetchJson } from '../composables/main.compose';
import NuevoUsuarioModal from './Usuarios/NuevoUsuarioModal.vue'
import { UsuarioTData } from '../../../shared/models/Usuario';
defineComponent({
  name:"Usuarios",
  components: {
    NuevoUsuarioModal
  }
})
const usuarios = ref([])
const tbl_headers = [
  {
    title: 'Nº',
    align: 'end',
    sortable: true,
    key: 'index',
  },
  {
    title: 'Nombre',
    align: 'start',
    sortable: true,
    key: 'nombre_completo',
  },
  {
    title: 'Usuario',
    align: 'start',
    sortable: true,
    key: 'username',
  },
  {
    title: 'Rol',
    align: 'start',
    sortable: true,
    key: 'rol',
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
    title: 'Acciones admin',
    align: 'start',
    sortable: false,
    key: 'actions'
  }
] as const

const borrarUsuario = async (usuario: UsuarioTData) => {
  try { 
    const response: Response = await fetch(`${getApiBase()}/usuarios/${usuario.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'aplication/json',
        // Add 'Authorization': 'Bearer token' here if needed
      }
    });
    if(response.ok) {
      const data = await response.json();
      console.log('Server response: ', data);
      fetchUsuarios()
    } else {
      console.error(`HTTP error! status: ${response.status}`);
    }  
    
   } catch (error) {
    console.error('Request failed:', error);
   }
}

const fetchUsuarios = async () => {
  const apiBase = getApiBase()
  console.log(`Connecting to backend at ${apiBase}`)
  try {
    const data = await safeFetchJson(apiBase + '/usuarios')
    usuarios.value = data
  } catch (err: any) {
    console.log(`Failed to connect: ${err.message || err}`);
  }
}
onMounted(async ()=> {
  await fetchUsuarios();
})

</script>