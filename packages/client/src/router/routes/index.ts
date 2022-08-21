import { RouteRecordRaw } from 'vue-router'

const NotFind = () => import('../../pages/404/index.vue')
const Index = () => import('../../pages/index/index.vue')
const routes: RouteRecordRaw[] = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFind },
  {
    path: '/',
    name: 'index',
    component: Index
    // children: [
    //   {
    //     path: 'dynamic/:id',
    //     component: Dynamic,
    //     meta: {
    //       requireLogin: false,
    //       isAdmin: true
    //     },
    //     name: 'dynamic'
    //   }
    // ]
  }
]

export default routes
