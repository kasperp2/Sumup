import { Cookies } from 'quasar';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
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
    name: 'About',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AboutPage.vue') }],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/record_details/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'record_details',
        path: '',
        component: () => import('pages/RecordDetails.vue'),
      },
    ],
  },
  {
    path: '/myaccount',
    name: 'MyAccount',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MyAccountPage.vue') },
    ],
  },
  {
    path: '/joinRoom',
    name: 'Join Room',
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
  {
    path: '/myaccount',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MyAccountPage.vue') },
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
