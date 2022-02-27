import React, { useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../common.css'
import day from 'dayjs'

type TodoDataListType = {
  [key: string]: string
}
function getSpecificDayToDoList (date: Date, data: TodoDataListType) {
  const dayString = day(date).format('YYYYMMDD').toString()
  const todoDateData = data[dayString]
  return todoDateData
}
export default function (props: {path: string}) {
  const [date, setDate] = useState(new Date());
  const [oriTodoDefaultValue, setOriTofoDefaultValue] = useState({'20220226': 'test String'} as TodoDataListType)
  const [todoDataList, setTodoDataList] = useState({} as TodoDataListType)

  useEffect(() => {
    setTodoDataList(oriTodoDefaultValue)
  }, [oriTodoDefaultValue]);
  const setDateProps = (date: Date) =>  setDate(date)
  const todoDataListComputed = useMemo(() => {
    return todoDataList
  }, [todoDataList])
  const setTodoDataListProps = (data: TodoDataListType) => setTodoDataList(data)
  return (
    <div className='app'>
      <h1 className='text-center'>React Calendar</h1>
      <CalendarComponent
        date={date}
        setDate={setDateProps}
        todoDataListComputed={todoDataListComputed}
        setTodoDataList={setTodoDataListProps}
      />
    </div>
  );
}
export function CalendarComponent (props: {
  date: Date
  setDate: (date: Date) => void
  todoDataListComputed: TodoDataListType
  setTodoDataList: (data: TodoDataListType) => void
}) {
  const [content, setContent] = useState('')
  useEffect(() => {
    const content = getSpecificDayToDoList(props.date, props.todoDataListComputed) || ''
    setContent(content)
  }, [props.date, props.todoDataListComputed])

  function setSpecificDayToDoList(text: string) {
    const toDoData = Object.assign({}, props.todoDataListComputed)
    const dayString = day(props.date).format('YYYYMMDD').toString()
    toDoData[dayString] = text
    props.setTodoDataList(toDoData)
  }
  return (
    <div className="flexClass">
      <div className='calendar-container'>
        <Calendar onChange={(e: Date) => props.setDate(e)} value={props.date} />
        <p className='text-center'>
          <span className='bold'>Selected Date:</span>
          {props.date.toDateString()}
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


