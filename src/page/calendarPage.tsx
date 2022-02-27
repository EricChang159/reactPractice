import React, { createContext, useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../common.css'
import day from 'dayjs'
import { useContext } from 'react';

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
export default function (props: {path: string}) {
  console.log('calendarPage')
  const [date, setDate] = useState(new Date());
  const [oriTodoDefaultValue, setOriTofoDefaultValue] = useState({'20220227': 'test String'} as TodoDataListType)
  const [todoDataList, setTodoDataList] = useState(oriTodoDefaultValue)

  // useEffect(() => {
  //   console.log('oriTodoDefaultValue effect')
  //   setTodoDataList(oriTodoDefaultValue)
  // }, [oriTodoDefaultValue]);
  // const setDateProps = (date: Date) =>  setDate(date)
  // const todoDataListComputed = useMemo(() => {
  //   return todoDataList
  // }, [todoDataList])
  // const setTodoDataListProps = (data: TodoDataListType) => setTodoDataList(data)
  const firstData = {
    date,
    setDate,
    todoDataList,
    oriTodoDefaultValue: oriTodoDefaultValue,
    setTodoDataList
  }
  return (
    <div className='app'>
      <h1 className='text-center'>React Calendar</h1>
      <Context.Provider value={firstData}>
        <CalendarComponent />
      </Context.Provider>
    </div>
  );
}
export function CalendarComponent () {
  const todoContext = useContext(Context)
  const [content, setContent] = useState('')
  useEffect(() => {
    console.log('CalendarComponent effect')
    const content = getSpecificDayToDoList(todoContext.date, todoContext.todoDataList) || ''
    setContent(content)
  }, [todoContext.date, todoContext.todoDataList])

  function setSpecificDayToDoList(text: string) {
    const toDoData = Object.assign({}, todoContext.todoDataList)
    const dayString = day(todoContext.date).format('YYYYMMDD').toString()
    toDoData[dayString] = text
    todoContext.setTodoDataList(toDoData)
  }
  return (
    <div className="flexClass">
      <div className='calendar-container'>
        <Calendar onChange={(e: Date) => todoContext.setDate(e)} value={todoContext.date} />
        <p className='text-center'>
          <span className='bold'>Selected Date:</span>
          {todoContext.date.toDateString()}
        </p>
      </div>
      <TodoBoard content={content} setContent={(text: string) => setContent(text)} doSaveContent={(text: string) => setSpecificDayToDoList(text)}/>
    </div>
  )
}

export function TodoBoard (props: {
  content: string
  doSaveContent: (text: string) => void
  setContent: (text: string) => void
}) {
  console.log('TodoBoard')
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


