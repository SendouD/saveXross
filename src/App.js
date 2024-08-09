import {useState, useEffect} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import { ethers } from "ethers";
import User from "./components/User.jsx";
import Verifier from "./components/Verifier.jsx";
import Admin from "./components/Admin.jsx";
import Bluexross from "./artifacts/contracts/Bluexross.sol/Bluexross.json";
import StakeTokens from "./artifacts/contracts/stakecoin.sol/StakeTokens.json";

const blueAddress = "0x40fC681E876a143Ec7358E74f75a9ED717B1fec1";
const stakeAddress = "0xB961fAc6a3Ae50661C8288dC3a5B5D5903CfD41B";
const rewardAddress = "0x9F16BE65Afb4a2Bb16EDCbA788708D590aA9cfa2";

function App() {
  const [ckverifier, setCkverifier] = useState(false);
  const [ckowner, setOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);

      const verifierAccess = await bluecontract.CheckverifierAccess();
      setCkverifier(verifierAccess);

      const ownerAccess = await bluecontract.checkOwner();
      setOwner(ownerAccess);

      setLoading(false);
    }

    fetchRoles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<User blueAddress={blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress} />} />
        <Route path="/user" element={<User blueAddress={blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress} />} />
        {ckverifier && <Route path="/verifier" element={<Verifier blueAddress={blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress} />} />}
        {ckowner && <Route path="/admin" element={<Admin blueAddress={blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress} />} />}
        <Route path="*" element={<Error/>} /> 
      </Routes>
    </>
  );
}

export default App;
