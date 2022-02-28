import React, { createContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../common.css'
import day from 'dayjs'
import { useContext } from 'react';
import { isConstructorDeclaration } from 'typescript';

type TodoDataListType = {
  [key: string]: string
}
function getSpecificDayToDoList (date: Date, data: TodoDataListType) {
  const dayString = day(date).format('YYYYMMDD').toString()
  const todoDateData = data[dayString]
  return todoDateData
}
type ContextType = {
  date: Date
  todoDataList: TodoDataListType
  oriTodoDefaultValue: TodoDataListType
  setDate: React.Dispatch<React.SetStateAction<Date>>
  setTodoDataList: React.Dispatch<React.SetStateAction<TodoDataListType>>
}
const Context = createContext({} as ContextType)
type ReducerStateType = {
  date: Date
  todoDataList: TodoDataListType
  content: string
}
type ReducerActionType = {
  type: 'setDate' | 'setTodoDataList' | 'setContent'
  value: any
}
function initReducer() {
  return {
    date: new Date(),
    todoDataList: {'20220228': 'test string'},
    content: ''
  }
}
function reducer(state: ReducerStateType, action: ReducerActionType): ReducerStateType{
  switch(action.type) {
    case 'setDate':
      return {...state, date: action.value}
    case 'setTodoDataList':
      return Object.assign({}, state, { todoDataList: action.value })
    case 'setContent':
      return Object.assign({}, state, { content: action.value })
    default:
      return state
  }
}
export default function (props: {path: string}) {
  console.log(1)
  return (
    <div className='app'>
      <h1 className='text-center'>React Calendar</h1>
        <CalendarComponent />
    </div>
  );
}
export function CalendarComponent () {
  console.log('CalendarComponent')
  const [state, dispatch] = useReducer(reducer, initReducer())
  useEffect(() => {
  console.log('CalendarComponent effect')

    const content = getSpecificDayToDoList(state.date, state.todoDataList) || ''
    dispatch({type: 'setContent', value: content})
  }, [state.date, state.todoDataList])

  useEffect(() => {
    console.log('CalendarComponent 2')
    dispatch({type: 'setContent', value: 'content'})

  }, [state.date, state.todoDataList])

  function setSpecificDayToDoList(text: string) {
    const toDoData = Object.assign({}, state.todoDataList)
    const dayString = day(state.date).format('YYYYMMDD').toString()
    toDoData[dayString] = text
    dispatch({type: 'setTodoDataList', value: toDoData})
  }
  return (
    <div className="flexClass">
      <div className='calendar-container'>
        <Calendar onChange={(e: Date) => dispatch({type: 'setDate', value: e})} value={state.date} />
        <p className='text-center'>
          <span className='bold'>Selected Date:</span>
          {state.date.toDateString()}
        </p>
      </div>
      <TodoBoard content={state.content} setContent={(text: string) => dispatch({type: 'setContent', value: text})} doSaveContent={(text: string) => setSpecificDayToDoList(text)}/>
    </div>
  )
}
// 沒有每次渲染 要檢查
export function TodoBoard (props: {
  content: string
  doSaveContent: (text: string) => void
  setContent: (text: string) => void
}) {
  const style = {
    width: '300px',
    height: '300px',
    border: '1px solid blue',
  }
  return (
    <div style={style}>
      <textarea className="w100 h100 p10" value={props.content} onChange={(e) => props.setContent(e.target.value)} />
      <button onClick={() => props.doSaveContent(props.content)}> save </button>
    </div>
  )
}


