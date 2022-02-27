import React, { lazy } from "react"
import { RouteObject } from 'react-router-dom'


// const data = require.context('./page', false, /\.tsx$/, 'sync')
// export const routerMap: RouteObject[] = []
// for (const key of data.keys()) {
//   const component = data(key).default
//   if (!component) continue
//   if(key.match('page')) continue
//   const path = key.replace('./', '').replace('.tsx', '')
//   if (path === 'notFoundPage') {
//     // const comp = data(key).default
//     routerMap.push({
//       path: `*`,
//       element:  component()
//     })
//   } else {
    
//     routerMap.push({
//       path: `${path}`,
//       element: component
//     })
//   }
// }
// console.log()

// lazy(() => import('./page/firstPage')),
// lazy(() => import('./page/calendarPage'))
// lazy(() => import('./page/notFoundPage'))
import FirstPage from './page/firstPage'
import CalendarPage from './page/calendarPage'
import NotFoundPage from './page/notFoundPage'

export const routerMap: RouteObject[] = [
  {
      path: "/",
      element: <FirstPage path="/"/>,
  },
  { path: "/CalendarPage", element: <CalendarPage path="/CalendarPage"/> },
  { path: "*", element: <NotFoundPage path="*"/> }
]