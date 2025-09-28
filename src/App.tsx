import { Routes, Route } from 'react-router-dom'
import Navbar from './components/NavBar'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import BookPage from './pages/BookPage'
import Favourites from './pages/Favourites'

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookPage />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
