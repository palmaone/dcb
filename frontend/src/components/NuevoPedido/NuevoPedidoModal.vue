<template>
  <v-dialog v-model="showDialog" persistent max-width="700">
    <v-card>
      <v-toolbar>
        <v-toolbar-title class="font-weight-black text-deep-orange-accent-4">Nuevo Pedido</v-toolbar-title>
        <v-spacer />
        <v-btn append-icon="mdi-close" variant="text" color="deep-orange-accent-4" @click="close">Cerrar</v-btn>
      </v-toolbar>
      <v-stepper v-model="stepModel" :items="steps">
        <template #item.1>
          <datos-cliente />
        </template>
        <template #item.2>
          <detalles-pedido />
        </template>
        <template #item.3>
          <v-card title="Paso 3"></v-card>
        </template>
        <template #actions="{ next, prev }">
          <v-sheet class="d-flex justify-space-between pa-2" width="100%">
            <v-btn :disabled="stepModel < steps.length - 1" variant="tonal" color="deep-orange-accent-4"
              @click="prev">Anterior</v-btn>
            <v-spacer />
            <v-btn :disabled="stepModel > steps.length - 1" variant="tonal" color="deep-orange-accent-4"
              @click="next">Siguiente</v-btn>
          </v-sheet>
        </template>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref, computed, defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { uiStore } from '../../stores/ui.store.ts'
import DatosCliente from './DatosCliente.vue'
import DetallesPedido from './DetallesPedido.vue'

defineComponent({
  name: 'NuevoPedidoModal',
  components: {
    DatosCliente,
    DetallesPedido
  }
})

const { showNewOrderModal } = uiStore()
const { newOrderModal } = storeToRefs(uiStore())

const stepModel = ref(1)
const steps = ['Datos Cliente', 'Detalles Pedido', 'Info Entrega']
const showDialog = computed({
  get: function () {
    return newOrderModal.value
  },
  set: function (shouldShow: boolean) {
    showNewOrderModal(shouldShow)
  }
})

function close() {
  showNewOrderModal(false)
}
</script>