import {useState, useEffect} from "react";
import {Routes, Route} from "react-router-dom";
import { ethers } from "ethers";
import User from "./components/User.jsx";
import Verifier from "./components/Verifier.jsx";
import Admin from "./components/Admin.jsx";
import Error from "./components/Error.jsx"
import Bluexross from "./artifacts/contracts/Bluexross.sol/Bluexross.json";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// const blueAddress = "0x40fC681E876a143Ec7358E74f75a9ED717B1fec1";
// const stakeAddress = "0xB961fAc6a3Ae50661C8288dC3a5B5D5903CfD41B";
// const rewardAddress = "0x9F16BE65Afb4a2Bb16EDCbA788708D590aA9cfa2";

const blueAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const stakeAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const rewardAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function App() {
  const [ckverifier, setCkverifier] = useState(false);
  const [ckowner, setOwner] = useState(false);



  /////////////////////////////////


    
  const [stakeBalance, setStakeBalance] = useState("");
  const [rewardBalance, setRewardBalance] = useState("");
  const [add,setAdd] = useState("")
  const [bluecontract, setBlueContract]=useState(null);

  useEffect(() => {
      async function initContract() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
        setBlueContract(bluecontract);
      }
  
      initContract();
      getAdd();
      getBalance();
      ckVerifyer();
      ckAdmin();
    }, []);


  
async function getBalance() {
  if (bluecontract) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const stakeData = await bluecontract.getstakebalance();
      setStakeBalance(stakeData.toString());

      const rewardData = await bluecontract.getrewardbalance();
      setRewardBalance(rewardData.toString());
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}

async function ckVerifyer() {
  if (bluecontract) {
    const transaction = await bluecontract.CheckverifierAccess();
    setCkverifier(transaction);
  }
}

async function ckAdmin() {
  if (bluecontract) {
    const transaction = await bluecontract.checkOwner();
    setOwner(transaction);
  }
}


  async function getAdd() {
      try{
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const temp = await signer.getAddress();
          setAdd(temp);
      }
      catch(err) {
          alert("Check if u are logged into your wallet!!");
      }
  }
  

  
  /////////////////////////////////

  useEffect(() => {
    async function fetchRoles() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
      const verifierAccess = await bluecontract.CheckverifierAccess();
      setCkverifier(verifierAccess);
      const ownerAccess = await bluecontract.checkOwner();
      setOwner(ownerAccess);

    }

    fetchRoles();
  }, []);

  return (
    <>
    <Header blueAddress={blueAddress} ckv={ckverifier} cka={ckowner}/>
      <Routes>
        <Route path="/" element={<User blueAddress={blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress} />} />
        <Route path="/user" element={<User blueAddress={blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress} />} />
        {ckverifier && <Route path="/verifier" element={<Verifier blueAddress={blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress} />} />}
        {ckowner && <Route path="/admin" element={<Admin blueAddress={blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress} />} />}
        <Route path="*" element={<Error/>} /> 
      </Routes>
      <Footer />
    </>
  );
}

export default App;
