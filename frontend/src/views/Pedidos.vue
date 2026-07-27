<template>
    <v-container fluid>
        <v-card flat>
            <v-tabs v-model="tabIndex" density="default" color="orange-darken-4" >
                <v-tab variant="tonal" v-for="tab in tabs" :key="tab.title" :to="tab.path">
                    <span>{{ tab.title }} </span>
                    <v-icon class="pl-2"> {{ tab.icon }} </v-icon>
                </v-tab>
            </v-tabs>
        </v-card>
        <router-view />
    </v-container>  
</template>
<script setup lang="ts">
import {ref, defineComponent} from 'vue'
defineComponent({
    name: 'Pedidos'
})
const tabIndex = ref(0)
const tabs = ref([
    { title: 'Pendientes', path: '/pedidos/pendientes', icon: 'mdi-clock-outline' },
    { title: 'Por Entregar', path: '/pedidos/por-entregar', icon: 'mdi-truck-delivery-outline' },
    { title: 'Procesando', path: '/pedidos/procesando', icon: 'mdi-cog' },
    { title: 'Entregados', path: '/pedidos/entregados', icon: 'mdi-package-variant-closed-check' },
    { title: 'Todos', path: '/pedidos/todos', icon: 'mdi-view-list' },
])
</script>