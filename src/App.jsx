import { BrowserRouter, Routes, Route } from "react-router-dom"
import ThreadsList from './pages/ThreadsListPage'
import Home from './pages/Home'
import ThreadPage from './pages/ThreadPage'
import NotFoundPage from "./pages/NotFoundPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thread" element={<ThreadsList />} />
        <Route path="/thread/:id" element={<ThreadPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App