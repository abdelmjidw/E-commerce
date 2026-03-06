import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import  Header  from './components/Header'
import { Toaster } from "react-hot-toast";
import Footer from './components/Footer'
import './App.css'
import AuthModal from "../src/components/AuthModal.jsx";

function App() {


  return (
    <>
       <Toaster position="top-left" />
    <Header/>
    <AuthModal/>
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products /> } />
    </Routes>
    <Footer/>
    </>
  )
}

export default App
