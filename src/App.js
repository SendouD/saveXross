import {useState, useEffect, useRef} from "react"
import {Routes, Route} from "react-router-dom"
import User from "./components/User.jsx"
import Verifier from "./components/Verifier.jsx"
import Admin from "./components/Admin.jsx"

function App() {

  return(
    <>
        <Routes>
            <Route path="/" element={<User/>}/>
            <Route path="/user" element={<User/>}/>
            <Route path="/verifier" element={<Verifier/>}/>
            <Route path="/admin" element={<Admin/>}/>
        </Routes>
    </>
  )
}

export default App