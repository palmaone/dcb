<template>
  <v-dialog max-width="500" persistent>
     <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="deep-orange-accent-4" 
        text="Crear Sucursal"
        variant="flat"
      >
        <template #append>
          <v-icon size="x-large">mdi-plus</v-icon>
        </template>
      </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar title="Agrega una nueva sucursal">
          <v-btn
            text="Cerrar"
            @click="isActive.value = false"
          >
            <template #append>
              <v-icon color="red">mdi-close</v-icon>
            </template>
          </v-btn>
        </v-toolbar>
        <form @submit.prevent="submit(isActive)">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="sucursal_form.nombre" label="Nombre" placeholder="Nombre de la sucursal"></v-text-field>
              </v-col>
              <v-col  cols="12">
                  <v-radio-group
                    v-model="sucursal_form.tipo"
                    inline
                    label="Tipo de sucursal"
                  >
                    <v-radio
                      label="Matriz"
                      value="matriz"
                    ></v-radio>
                    <v-radio
                      label="Punto de Venta"
                      value="punto_venta"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              <v-col cols="12">
                <v-text-field v-model="sucursal_form.direccion" label="Dirección"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="sucursal_form.telefono" label="Telefono" type="phone"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="sucursal_form.email" label="email" type="email"></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="cancel(isActive)">Cancelar</v-btn>
            <v-btn
              :disabled="!validData"
              :color="validData ? 'green-darken-2' : 'default'"
              variant="flat"
              type="submit"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>

    </template>
  </v-dialog>
</template>
<script lang="ts" setup>
import { computed, reactive, Ref } from 'vue';
import { NuevaSucursal } from '../../../../shared/models/Sucursal';
import { getApiBase } from '../../composables/main.compose';

const emit = defineEmits(["sucursalCreada"]);
const sucursal_form = reactive<NuevaSucursal>({
  nombre: '',
  tipo: '',
  telefono: '',
  email: '',
  direccion: ''
});

const validData = computed((): boolean => {
  return !!sucursal_form.nombre
    && !!sucursal_form.tipo
    && !!sucursal_form.telefono
    && !!sucursal_form.email
    && !!sucursal_form.direccion
});

const submit = async (isActive: Ref<boolean, boolean>) => {
  const nueva_sucursal = { ...sucursal_form } as NuevaSucursal

  try {
    const response: Response = await fetch(`${getApiBase()}/sucursales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'aplication/json',
        // Add 'Authorization': 'Bearer token' here if needed
      },
      body: JSON.stringify(nueva_sucursal)
    });
    if (response.ok) {
      const data = await response.json()
      console.log('Server response: ', data);
      emit('sucursalCreada');
      isActive.value = false;
      resetFormData();
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

const cancel = (isReactive: Ref<boolean, boolean>) => {
  isReactive.value = false;
  resetFormData()
}

const resetFormData = () => {
  sucursal_form.nombre = '';
  sucursal_form.tipo = '';
  sucursal_form.telefono = '';
  sucursal_form.email = '';
  sucursal_form.direccion = '';
}
</script>