import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },
  {
    path: '/record',
    name: 'Record',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/RecordPage.vue') }],
  },
  {
    path: '/about',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AboutPage.vue') }],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/joinRoom',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/JoinRoomPage.vue') }],
  },
  {
    path: '/myaccount',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MyAccountPage.vue') },
    ],
  },
  {
    path: '/joinRoom',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/JoinRoomPage.vue') }],
  },
  {
    path: '/createRoom',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CreateRoomPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
