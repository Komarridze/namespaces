import { useState } from "react"
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from './pages/login'


import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<LoginPage/>}>

      </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
