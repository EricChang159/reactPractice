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
const CalendarContext = createContext({} as {calendarState: ReducerStateType, calendarDispatch: React.Dispatch<ReducerActionType>})
export default function (props: {path: string}) {
  const [state, dispatch] = useReducer(reducer, initReducer())

  console.log(1)
  return (
    <div className='app'>
      <h1 className='text-center'>React Calendar</h1>
      <CalendarContext.Provider value={{calendarState: state, calendarDispatch: dispatch}}>
        <CalendarComponent />
      </CalendarContext.Provider>
    </div>
  );
}
export function CalendarComponent () {
  console.log('CalendarComponent')
  const { calendarState, calendarDispatch} = useContext(CalendarContext)
  
  // const [state, dispatch] = useReducer(reducer, initReducer())
  // 注意這邊，先用 memo 包起來之後，可以將取值的邏輯坐在 memo，由 memo 來判斷有沒有變，沒有他會返回一樣的ref，這樣就可以放在 useEffect 依賴上
  // 用來檢查是否有變動 要不要觸法 effect
  const memoDate = useMemo(() => {
    console.log('memo test')
    const content = getSpecificDayToDoList(calendarState.date, calendarState.todoDataList) || ''
    return content
  }, [calendarState.date])
  useEffect(() => {
  console.log('CalendarComponent effect')
    calendarDispatch({type: 'setContent', value: memoDate})
  }, [memoDate])

  return (
    <div className="flexClass">
      <div className='calendar-container'>
        <Calendar onChange={(e: Date) => calendarDispatch({type: 'setDate', value: e})} value={calendarState.date} />
        <p className='text-center'>
          <span className='bold'>Selected Date:</span>
          {calendarState.date.toDateString()}
        </p>
      </div>
      <TodoBoard />
    </div>
  )
}
// 沒有每次渲染 要檢查
export function TodoBoard () {
  const { calendarState, calendarDispatch} = useContext(CalendarContext)
  // const [testContent, setTestContent] = useState(calendarState.content) // 這個無效，不知道為什麼 test 會是空直
  function setSpecificDayToDoList(text: string) {
    const toDoData = Object.assign({}, calendarState.todoDataList)
    const dayString = day(calendarState.date).format('YYYYMMDD').toString()
    toDoData[dayString] = text
    calendarDispatch({type: 'setTodoDataList', value: toDoData})
  }

  // const content = useRef(calendarState.content)
  const style = {
    width: '300px',
    height: '300px',
    border: '1px solid blue',
  }
  return (
    <div style={style}>
      <textarea className="w100 h100 p10" value={calendarState.content} onChange={(e) => calendarDispatch({type: 'setContent', value: e.target.value})} />
      <button onClick={() => setSpecificDayToDoList(calendarState.content)}> save </button>
    </div>
  )
}


