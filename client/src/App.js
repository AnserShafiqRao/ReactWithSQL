import React from 'react'
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import Home from './Home'
import UserCreation from './UserCreation'
import About from './Pages/About'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<UserCreation />}/>
        <Route path='/:UserName' element={<Home />}/>
        <Route path='/:UserName/about' element={<About />} />
      </Routes>
    </Router>
  )
}

export default App