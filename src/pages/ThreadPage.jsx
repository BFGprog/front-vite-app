import { useEffect, useState } from "react"
import Thread from "../thread/Thread"
import Comments from "../thread/Comments"
import { useParams } from "react-router-dom"
import AddComment from "../thread/AddComments"
import { useNavigate } from "react-router-dom"


const API_URL = "http://localhost:8080"

const ThreadPage = () => {
  const navigate = useNavigate()
  const { id: threadId } = useParams()

  const [thread, setThread] = useState(null)
  const [comments, setComments] = useState([])
  const handleAddComment = (newComment) => {
    setComments(prev => [...prev, newComment])
  }

  useEffect(() => {
    fetch(`${API_URL}/thread/${threadId}`)
      .then(res => /*res.json())*/{
        if (!res.ok) {
          throw new Error("Thread not found")
        }
        return res.json()
      })
      .then(data => setThread(data))
      .catch(err => {
        console.error(err)
        navigate("/404")
      })

    fetch(`${API_URL}/thread/${threadId}/comments`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(console.error)
  }, [threadId, navigate])

  if (!thread) return <p>Loading...</p>

  return (
    <div>
      <h1>Комментарии</h1> 
      <AddComment threadId={threadId} onAdd={handleAddComment} />
      <Thread thread={thread} />
      <Comments comments={comments} />
      
    </div>
  )
}

export default ThreadPage