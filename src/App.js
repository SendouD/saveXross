import {useState, useEffect} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import { ethers } from "ethers";
import User from "./components/User.jsx";
import Verifier from "./components/Verifier.jsx";
import Admin from "./components/Admin.jsx";
import Error from "./components/Error.jsx"
import Bluexross from "./artifacts/contracts/Bluexross.sol/Bluexross.json";
import StakeTokens from "./artifacts/contracts/stakecoin.sol/StakeTokens.json";

const blueAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
const stakeAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
const rewardAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

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
