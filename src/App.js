import React, { Component, Fragment } from 'react'
import { useRoutes } from 'react-router-dom';
import {routerMap} from './routerMap'

console.log(routerMap, 'routerMap')

function App() {
  let Element = useRoutes(routerMap)
    return Element
}
export default App
