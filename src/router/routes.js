const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('pages/ConsultaIbge.vue')
      }
    ],

  }
]

export default routes
