<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar title="Bakery" density="compact" class="px-3">
        <v-btn 
          v-tooltip.bottom="theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'"
          :icon="theme === 'light' ? 'mdi-weather-sunny':'mdi-weather-night'"
          slim
          @click="toggleTheme"
        />

      </v-app-bar>
      <v-navigation-drawer 
        :color="theme === 'light' ? 'orange-darken-4' : 'default'" :dark="theme === 'light'"
        expand-on-hover
        permanent
        rail
        app
      >
        <v-list>
          <v-list-item>
            <template #prepend>
              <v-avatar size="30" variant="outlined">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list density="compact" nav>
          <v-list-item v-for="route in routeLinks" :prepend-icon="route.icon" link :to="route.path">
            <v-list-item-title>{{ route.titulo }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <template #append>
          <v-btn variant="plain" icon>
            <!-- <v-icon>mdi-lock</v-icon> -->
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
      </v-navigation-drawer>
      <v-main>
        <RouterView />
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import { ref, defineComponent } from 'vue'

defineComponent({
  name: 'App'
})

const theme = ref('light')
const routeLinks = [
  {
    titulo: 'Panel de inicio',
    icon: 'mdi-home',
    path: '/'
  },
  {
    titulo: 'Pedidos',
    icon: 'mdi-cake-variant',
    path: '/pedidos'
  },
  {
    titulo: 'Clientes',
    icon: 'mdi-account-cash',
    path: '/clientes'
  },
  {
    titulo: 'Usuarios',
    icon: 'mdi-badge-account',
    path: '/usuarios'
  },
  {
    titulo: 'Sucursales',
    icon: 'mdi-store',
    path: '/sucursales'
  }
]

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>