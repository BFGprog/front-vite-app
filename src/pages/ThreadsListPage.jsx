
import React, { useEffect, useState } from 'react'
import Thread from '../thread/Thread'
import AddThread from "../thread/AddThread"
import { Link } from "react-router-dom"

const ThreadsList = () => {

//const API_URL = "http://localhost:8080"
const API_URL = ""

  const [threads, setThreads] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/thread`)
      .then(res => res.json())
      .then(data => setThreads(data))
      .catch(console.error)
  }, [])

return (
  <div>
    <h1>Все темы</h1>
    <div style={{ fontWeight: "bold", margin: 15 }} >Новые темы и комментарии удаляются каждые 5 минут.</div>

      <AddThread />
      {threads.map(t => (
      <Link
        key={t.id}
        to={`/thread/${t.id}`}
        style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
      >
        <Thread thread={t} />
      </Link>
      ))}
  </div>
)

}
export default ThreadsList