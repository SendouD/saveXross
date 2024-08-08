import {useState, useEffect, useRef} from "react"
import {Routes, Route} from "react-router-dom"
import User from "./components/User.jsx"
import Verifier from "./components/Verifier.jsx"
import Admin from "./components/Admin.jsx"

const blueAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const stakeAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const rewardAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function App() {

  return(
    <>
      <Routes>
        <Route path="/" element={<User blueAddress = {blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress}/>}/>
        <Route path="/user" element={<User blueAddress = {blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress}/>}/>
        <Route path="/verifier" element={<Verifier blueAddress = {blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress}/>}/>
        <Route path="/admin" element={<Admin blueAddress = {blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress}/>}/>
      </Routes>
    </>
  )
}

export default App