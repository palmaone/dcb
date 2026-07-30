<template>
  <v-dialog max-width="600" persistent>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="deep-orange-accent-4" 
        text="Crear Cliente"
        variant="flat"
      >
        <template #append>
          <v-icon size="x-large">mdi-plus</v-icon>
        </template>
      </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar title="Agrega un nuevo cliente">
          
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
          <v-form >
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="nombre"
                  label="Nombre*"
                  placeholder="Nombre de pila"
                  :rules="[required_field]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="apellido" label="Apellido*" :rules="[required_field]"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="domicilio" label="Domicilio*" :rules="[required_field]"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="colonia" label="Colonia*" :rules="[required_field]"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="entreCalles" label="Entre calles*" :rules="[required_field]"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="personaConfianza" label="Persona de confianza" type="text" :rules="[required_field]"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="telefono" label="Telefono*" type="phone" :rules="[required_field, valid_phone]"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="email" label="email*" type="email" :rules="[required_field, valid_email]"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-row>
            <v-col cols="12">
              <v-textarea v-model="notas" label="Notas"></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="cancel(isActive)">Cancelar</v-btn>
          <v-btn
            :disabled="!validData"
            :color="validData ? 'green-darken-2' : 'default'"
            variant="flat"
            @click="save(isActive)"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>

    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { NuevoCliente } from '../../../../shared/models/Cliente';
import { required_field, is_valid_email, valid_email, valid_phone, is_valid_phone } from '../../composables/form-utils.composable';
import { computed, reactive, ref, Ref } from 'vue'
import { getApiBase } from '../../composables/main.compose';
const apiBase = getApiBase()
const emit = defineEmits([ "clienteCreado" ])
const nombre = ref('')
const apellido =  ref('')
const domicilio =  ref('')
const colonia =  ref('')
const entreCalles =  ref('')
const personaConfianza =  ref('')
const telefono =  ref('')
const email = ref('')
const notas = ref<string|null>(null)

// const form = reactive<NuevoCliente>({
//   nombre: '',
//   apellido: '',
//   domicilio: '',
//   colonia: '',
//   entre_calles: '',
//   persona_confianza: '',
//   telefono: '',
//   email: '',
//   notas: null,
// })

const validData = computed((): boolean=> {
  return !!nombre.value 
    && !!apellido.value
    && !!domicilio.value
    && !!colonia.value
    && !!entreCalles.value
    && !!personaConfianza.value
    && !!telefono.value && (
      is_valid_phone(telefono.value, 'MX')
      || is_valid_phone(telefono.value, 'US')
      || is_valid_phone(telefono.value, 'CA')
      || is_valid_phone(telefono.value, 'FR')
      || is_valid_phone(telefono.value, 'ES')
      || is_valid_phone(telefono.value, 'GB')
    )
    && !!email.value && is_valid_email(email.value)
});

const save = async (isActive: Ref<boolean, boolean>) => {
  const cliente: NuevoCliente = {
    nombre: nombre.value,
    apellido: apellido.value,
    domicilio: domicilio.value,
    colonia: colonia.value,
    entre_calles: entreCalles.value,
    persona_confianza: personaConfianza.value,
    telefono: telefono.value,
    email: email.value,
    notas: notas.value ? notas.value : null
  } 

  console.log(cliente);
  try { 
    const response: Response = await fetch(`${apiBase}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'aplication/json',
        // Add 'Authorization': 'Bearer token' here if needed
      },
      body: JSON.stringify(cliente)
    });
    if(!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();
      console.log('Server response: ', data);
      isActive.value = false
      emit('clienteCreado')
    }
    
  } catch (error) {
    console.error('Request failed:', error);
  }

  
}
const cancel = (isActive: Ref<boolean, boolean>) => {
  isActive.value = false
  nombre.value = '' 
  apellido.value = ''
  domicilio.value = ''
  colonia.value = ''
  entreCalles.value = ''
  personaConfianza.value = ''
  telefono.value = ''
}

</script>