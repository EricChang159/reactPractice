import { Link } from 'react-router-dom';
import React from 'react'
export default function (props: any) {
  console.log(props.match)
  return (
    <div>
      <div>
        this page not found
      </div>
        <div><Link to='/'>go back  to home</Link></div>
    </div>
  )
}