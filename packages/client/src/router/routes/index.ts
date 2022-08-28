import { RouteRecordRaw } from 'vue-router'

const NotFind = () => import('../../pages/404/index.vue')
const Index = () => import('../../pages/index/index.vue')
const routes: RouteRecordRaw[] = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFind },
  {
    path: '/',
    children: [
      {
        path: '/',
        name: 'index',
        component: Index
      },
      {
        path: '/share/:id',
        name: 'share',
        component: Index
      }
    ]
  }
]

export default routes
