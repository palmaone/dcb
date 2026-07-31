<template>
  <v-card>
    <v-toolbar>
      <!-- <v-toolbar-title
        :text="nuevoCliente ? 'Crear Nuevo Cliente' : 'Buscar Cliente Existente'"
      ></v-toolbar-title> -->
      
      <v-switch
        v-model="nuevoCliente"
        true-icon="mdi-account-plus"
        false-icon="mdi-magnify"
        :color="nuevoCliente ? 'green-darken-2' : 'default'"
        :label="nuevoCliente ? 'Creando un cliente nuevo' : 'Buscando un cliente existente'"
        class="ml-2"
      ></v-switch>
      <v-spacer></v-spacer>
      <v-btn
        :color="nuevoCliente ? 'blue-grey' : 'green-darken-2'"
        class="mb-6"
        variant="flat"
        :text="nuevoCliente ? 'Buscar' : 'Crear'"
        @click="nuevoCliente = !nuevoCliente"
      >
        <template #prepend>
          <v-icon
            size="x-large"
            
            :icon="nuevoCliente ? 'mdi-magnify' : 'mdi-plus'"
          ></v-icon>
        </template>
      </v-btn>
    </v-toolbar>
     <v-expand-transition>
      <div v-show="nuevoCliente" id="crear-cliente">
        <v-card-text id="nuevo-cliente">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="Nombre" variant="outlined" />
              <v-text-field label="Teléfono" variant="outlined" />
              <v-text-field label="Calle" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Apellidos" variant="outlined" />
              <v-text-field label="Correo electrónico" variant="outlined" />
              <v-text-field label="Colonia" variant="outlined" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field label="Entre calles" variant="outlined" />
            </v-col>
            <v-col cols="3">
              <v-text-field label="Número exterior" variant="outlined" />
            </v-col>
            <v-col cols="3">
              <v-text-field label="C.P" variant="outlined" />
            </v-col>
          </v-row>
        </v-card-text>
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <div v-show="!nuevoCliente" id="buscar-clientes">
        <v-card-text >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="clientesSearchQuery"
                label="Nombre de tu cliente"
                persistent-hint
                hint="Busca por su nombre al cliente que deseas encontrar."
                :loading="clientesSearchQuery?.length > 0"
                :color="clientesSearchQuery?.length > 0 ? 'green-darken-2' : 'default'"
                focused
                clearable
                @update:model-value="search"
              >
                <template #append-inner>
                  <v-btn
                    :text="clientesSearchQuery?.length > 0 ? 'Buscando...':'Buscar'"
                    :color="clientesSearchQuery?.length > 0 ? 'green-darken-2' : 'blue-grey-lighten-1'" 
                    variant="tonal"
                    size="default"
                  >
                    <template #append>
                        <v-icon size="x-large">mdi-magnify</v-icon>
                      </template>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="clientes">
            <v-col cols="12">
              <v-card>
                <v-list>
                  <v-list-item v-for="cliente in clientes" @click="saveCliente(cliente)">
                    <span>{{ cliente.nombre }}</span>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </div>
      </v-expand-transition>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { getApiBase, safeFetchJson } from '../../composables/main.compose';
import { Cliente } from '../../../../shared/models/Cliente';
const emit = defineEmits(["clientSelected"])
const nuevoCliente = ref(false);
const clientesSearchQuery = ref('');
const clientes = ref<Cliente[]>([])
const search = async () => {

  try {
    const data = await safeFetchJson(getApiBase() + `/clientes/search?nombre=${clientesSearchQuery.value}`)

    console.log("data", data);
    clientes.value = data
  } catch (err: any) {
    console.log(`Failed to connect: ${err.message || err}`);
  }
}
const saveCliente = (cliente: Cliente) => {
  console.log("save");
  emit('clientSelected', cliente)
}
</script>
