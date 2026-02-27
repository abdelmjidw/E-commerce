import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import  Header  from './components/Header'
import Footer from './components/Footer'
import './App.css'
import LoginModal from "../src/components/LoginModal.jsx";

function App() {


  return (
    <>
    <Header/>
    <LoginModal/>
    <Routes>
        <Route path='/' element={<Home />} />
    </Routes>
    <Footer/>
    </>
  )
}

export default App
