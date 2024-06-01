
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupForm from './pages/signup'
import LoginForm from './pages/login'
import Dashboard from './pages/adminHome'
import BookList from './pages/bookList'
import BookManagement from './pages/managebooks'
function App() {


  return (
    <>
      <Router>

        <Routes>
        <Route path='/manage-books' element={<BookManagement />}></Route>
          <Route path='/book-list' element={<BookList />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/login' element={<LoginForm />}></Route>
          <Route path='/signup' element={<SignupForm />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
