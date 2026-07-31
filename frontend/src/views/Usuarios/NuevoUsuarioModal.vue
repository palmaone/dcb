<template>
  <v-dialog max-width="500" persistent>
     <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="deep-orange-accent-4" 
        text="Crear Usuario"
        variant="flat"
      >
        <template #append>
          <v-icon size="x-large">mdi-plus</v-icon>
        </template>
      </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar title="Agrega un nuevo usuario">
          
          <v-btn
            text="Cerrar"
            @click="isActive.value = false"
          >
            <template #append>
              <v-icon color="red">mdi-close</v-icon>
            </template>
          </v-btn>
        </v-toolbar>
        <form  @submit.prevent="submit(isActive)">
          <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-text-field v-model="user_form.nombre" label="Nombre" placeholder="Nombre de pila"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="user_form.apellido" label="Apellido"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="user_form.telefono" label="Telefono" type="phone"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="user_form.email" label="email" type="email"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="user_form.username" label="Usuario"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="user_form.password" label="contraseña" type="password"></v-text-field>
                </v-col>
                <v-col  cols="7" offset="5">
                  <v-radio-group
                    v-model="user_form.rol"
                    inline
                  >
                    <v-radio
                      label="Administrador"
                      value="admin"
                    ></v-radio>
                    <v-radio
                      label="Empleado"
                      value="empleado"
                    ></v-radio>
                  </v-radio-group>
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
import { computed, reactive, Ref } from 'vue'
import { NuevoUsuario } from '../../../../shared/models/Usuario';
import { getApiBase } from '../../composables/main.compose';

const emit = defineEmits(["usuarioCreado"]);
const user_form = reactive<NuevoUsuario>({
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  username: '',
  password: '',
  rol: ''
});

const validData = computed((): boolean=> {
  return !!user_form.nombre
    && !!user_form.apellido
    && !!user_form.telefono
    && !!user_form.email
    && !!user_form.username
    && !!user_form.password
    && !!user_form.rol
})
const submit = async (isActive: Ref<boolean, boolean>) => {
  const nuevo_usuario =  { ...user_form } as NuevoUsuario;
  try {
    const response: Response = await fetch(`${getApiBase()}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'aplication/json',
        // Add 'Authorization': 'Bearer token' here if needed
      },
      body: JSON.stringify(nuevo_usuario)
    });
    if(response.ok) {
      const data = await response.json()
      console.log('Server response: ', data);
      emit('usuarioCreado')
      resetFormData();
      isActive.value = false
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
  
}
const cancel = (isActive: Ref<boolean, boolean>) => {
  isActive.value = false
  resetFormData()
}

const resetFormData = () => {
  user_form.nombre = ''
  user_form.apellido = ''
  user_form.telefono = ''
  user_form.email = ''
  user_form.username = ''
  user_form.password = ''
  user_form.rol = ''
}
</script>