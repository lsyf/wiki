import Vue from 'vue'
import VueRouter from 'vue-router'

import WikiEditor from "@/views/WikiEditor";
import PageList from "@/views/PageList";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'PageList',
        component: PageList
    },
    {
        path: '/editor/:id',
        name: 'WikiEditor',
        component: WikiEditor
    }
]

const router = new VueRouter({
    routes
})

export default router
