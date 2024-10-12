import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./css/Header.css";
import Bluexross from "../artifacts/contracts/Bluexross.sol/Bluexross.json";
function Header({ blueAddress, ckv, cka }) {
    
    const [stakeBalance, setStakeBalance] = useState("");
    const [rewardBalance, setRewardBalance] = useState("");
    const [ckverifer, setCkverifier] = useState(false);
    const [ckowner, setOwner] = useState(false);
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
    
    return (
        <>
            <div className="center-header">
                <div className="header-body">
                    <div className="header-left">
                        <div className="logo-name">SaveXross</div>
                    </div>

                    <div className="header-middle">
                        <a href="/user" className="nav-links baba">User</a>
                       {(ckv)?<a href="/verifier" className="nav-links" >Verifier</a>: null}
                       {(cka)?<a href="/admin" className="nav-links">Admin</a>: null} 
                    </div>

                    <div className="header-right">
                        {
                            <span className="user-add">Acc:{add}</span>
                        }
                        <div>
                            <div>Stake coins: {stakeBalance} &#129689;</div>
                            <div>Reward coins: {rewardBalance} &#129689;</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
