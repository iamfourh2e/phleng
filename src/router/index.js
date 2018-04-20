import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/src/locale/lang/en'
//components
import Home from '@/components/Home'
import Artist from '@/components/Artist'
import NewArtist from '@/components/NewArtist'
import Upload from '@/components/Upload'

Vue.use(Router)
Vue.use(ElementUI, { locale })
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/artists',
      name: 'Artist',
      component: Artist,
    },
    {
      path: '/artists/new',
      name: 'NewArtist',
      component: NewArtist
    },
    {
      path: '/uploads',
      name: 'Upload',
      component: Upload
    }
  ]
})
