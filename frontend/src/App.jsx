import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import  Header  from './components/Header'
import Footer from './components/Footer'
import './App.css'


function App() {


  return (
    <>
    <Header/>
    <Routes>
        <Route path='/' element={<Home />} />
    </Routes>
    <Footer/>
    </>
  )
}

export default App
