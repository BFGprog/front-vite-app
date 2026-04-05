import { Link } from "react-router-dom"

function NotFoundPage() {
  return (
    <>
      <h1>404 Error</h1>

      <Link to="/thread">
        <button>Threads</button>
      </Link>
    </>
  )
}
export default NotFoundPage