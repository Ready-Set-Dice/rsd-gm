import Vue from 'vue'
import VueRouter from 'vue-router'

/* Local views */

const GameView = () => import('../views/GameView.vue')
const MobileView = () => import('../views/MobileView.vue')

/* Shared views */
const Blank = () => import('@root/.shared/views/Blank.vue')
const Login = () => import('@root/.shared/views/Login.vue')
const Signup = () => import('@root/.shared/views/Signup.vue')
const Forgot = () => import('@root/.shared/views/Forgot.vue')
const Logout = () => import('@root/.shared/views/Logout.vue')
const PasswordReset = () => import('@root/.shared/views/PasswordReset')

/* Testing views */
const TestPage = () => import('../views/TestPage.vue')

import auth from '@root/.shared/services/AuthService'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/login',
    category: 'hidden'
  },
  {
    path: '/',
    redirect: '/login',
    category: 'hidden'
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    category: 'hidden',
    meta: {
      requiresUnauth: true
    }
  },
  {
    path: '/forgot',
    name: 'Forgot Password',
    component: Forgot,
    category: 'hidden',
    meta: {
      requiresUnauth: true
    }
  },
  {
    path: '/pwreset',
    name: 'Password Reset',
    component: PasswordReset,
    category: 'hidden',
    meta: {
      requiresUnauth: true
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    category: 'hidden',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/home',
    name: 'GM Dashboard',
    component: GameView,
    icon: 'mdi-view-dashboard',
    category: 'head',
    meta: {
      customTitle: "",
      requiresAuth: true,
    }
  },
  {
    path: '/mobile',
    name: 'GM Mobile Dashboard',
    component: MobileView,
    icon: 'mdi-view-dashboard',
    category: 'head',
    meta: {
      customTitle: "",
      requiresAuth: true,
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    icon: 'mdi-login-variant',
    category: 'hidden',
    meta: {
      requiresUnauth: true,
      showOnNotLogin: true
    }
  },
  {
    path: '/#div1',
    type: 'divider',
  },
  // {
  //   path: '/hp',
  //   name: 'Back to homepage',
  //   component: Blank,
  //   icon: 'mdi-home',
  //   category: 'tool',
  //   beforeEnter() {location.href = 'https://readysetdice.com'}
  // },
  {
    path: '/rsd',
    name: 'RSD Home',
    component: Blank,
    icon: 'mdi-home',
    category: 'tool',
    beforeEnter() {location.href = 'https://readysetdice.com'}
  },
  {
    path: '/pc',
    name: 'Player Dashboard',
    miniName: 'PC',
    component: Blank,
    category: 'tool',
    beforeEnter() {location.href = 'https://pc.readysetdice.com'}
  },
  {
    path: '/test-page',
    name: 'Test Page',
    component: TestPage,
    icon: 'mdi-dev-to',
    meta: {
      requiresAuth: true,
    }
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  auth.authenticated().then(user => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresUnauth = to.matched.some(record => record.meta.requiresUnauth);
    const devOnly = to.matched.some(record => record.meta.devOnly)
    
    if (requiresAuth && !user) {
        next('login')
      } else if (requiresUnauth && !!user) {
        next('home')
      } else if (devOnly) {
        auth.profile().then(profile => {
          if (process.env.NODE_ENV !== "development" && (!!profile && !profile.dev)) {
            next('home')
          } else {
            next();
          }
        })
      } else {
        next();
      }
  })
});

export default router
