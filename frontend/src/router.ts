import { createWebHistory, createRouter } from 'vue-router'
const routes = [
  { path: '/', component: () => import('./views/Home.vue') },
  { path: '/clientes', component: () => import('./views/Clientes.vue') },
  { path: '/usuarios', component: () => import('./views/Usuarios.vue') },
  { path: '/sucursales', component: () => import('./views/Sucursales.vue') },
  { 
    name: 'pedidos',
    path: '/pedidos', 
    component: () => import('./views/Pedidos.vue'),
    redirect: '/pedidos/pendientes',
    children: [
        {
            name: 'pedidos-pendientes',
            path: 'pendientes',
            component: () => import('./views/Pedidos/Pendientes.vue')
        },
        {
            name: 'pedidos-procesando',
            path: 'procesando',
            component: () => import('./views/Pedidos/Procesando.vue')
        },
        {
            name: 'pedidos-por-entregar',
            path: 'por-entregar',
            component: () => import('./views/Pedidos/PorEntregar.vue')
        },
        {
            name: 'pedidos-entregados',
            path: 'entregados',
            component: () => import('./views/Pedidos/Entregados.vue')
        },
        {
            name: 'pedidos-todos',
            path: 'todos',
            component: () => import('./views/Pedidos/Todos.vue')
        }
    ],
    // meta: {}
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})