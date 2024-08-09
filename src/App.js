import {useState, useEffect, useRef} from "react"
import {Routes, Route} from "react-router-dom"
import User from "./components/User.jsx"
import Verifier from "./components/Verifier.jsx"
import Admin from "./components/Admin.jsx"

const blueAddress = "0x40fC681E876a143Ec7358E74f75a9ED717B1fec1";
const stakeAddress = "0xB961fAc6a3Ae50661C8288dC3a5B5D5903CfD41B";
const rewardAddress = "0x9F16BE65Afb4a2Bb16EDCbA788708D590aA9cfa2";

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