<template>
  <v-dialog max-width="500" persistent>
     <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="deep-orange-accent-4" 
        icon="mdi-plus"
        text="Open Dialog"
        variant="flat"
      ></v-btn>
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
        <v-card-text>
          <!-- <form action=""> -->
            <v-row>
              <v-col cols="6">
                <v-text-field label="Nombre" placeholder="Nombre de pila"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Apellido"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Telefono" type="phone"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="email" type="email"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Usuario"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="contraseña" type="password"></v-text-field>
              </v-col>
            </v-row>
          <!-- </form> -->
        </v-card-text>
        <v-card-actions>
          <v-btn @click="cancel(isActive)">Cancelar</v-btn>
          <v-btn>Guardar</v-btn>
        </v-card-actions>
      </v-card>

    </template>
  </v-dialog>
</template>
<script lang="ts" setup>
import { reactive, Ref } from 'vue'
import { NuevoUsuario } from '../../../../shared/models/Usuario';
const cancel = (isActive: Ref<boolean, boolean>) => {
  isActive.value = false
  const form = reactive<NuevoUsuario>({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    username: '',
    password: ''
  })
}
</script>