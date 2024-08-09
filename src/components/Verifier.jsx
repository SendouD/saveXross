import Header from "./Header.jsx"
import Footer from "./Footer.jsx"
import {useState, useEffect, useRef} from "react"
import { ethers } from "ethers"
import Bluexross from "../artifacts/contracts/Bluexross.sol/Bluexross.json"
import StakeTokens from "../artifacts/contracts/stakecoin.sol/StakeTokens.json"

function Verifier({blueAddress, stakeAddress, rewardAddress}) {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [issues, setIssues] = useState(null);
    const [stakeBalance, setStakeBalance ] = useState("");
    const [rewardBalance, setRewardBalance ] = useState("");

    async function getBalance() {
      if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          try {
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              

              const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
              const stakeData = await bluecontract.getstakebalance();
              setStakeBalance(stakeData.toString());

              const rewardData = await bluecontract.getrewardbalance();
              setRewardBalance(rewardData.toString());

              console.log(`Stake Balance: ${stakeBalance}, Reward Balance: ${rewardBalance}`);
          } catch (error) {
              console.log("Error: ", error);
          }
      }
  }

    async function requestAccount() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.5 } 
      );
  
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
      getBalance();
      setIssues(null);
      console.log(issues)
  
      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }, []);

    async function getIssues() {
      setIssues(null)
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            

            const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
            const data = await bluecontract.getIssues();
            console.log(data);
            setIssues(data);

            console.log(`Stake Balance: ${stakeBalance}, Reward Balance: ${rewardBalance}`);
        } catch (error) {
            console.log("Error: ", error);
        }
        await getBalance()
      }
    }

    async function tickPress(index) {
      if(typeof window.ethereum !== "undefined") {
        await requestAccount();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
        const transaction = await bluecontract.IssueVerify(false,index+1);
        await transaction.wait();
      }
      getIssues();
    }

    async function crossPress(index) {
      if(typeof window.ethereum !== "undefined") {
        await requestAccount();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
        const transaction = await bluecontract.IssueVerify(true,index+1);
        await transaction.wait();
      }
      getIssues();
    }

    return(
        <>
            <Header blueAddress = {blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress} stakeBalance={stakeBalance} rewardBalance={rewardBalance}/>

            <div className="body">
                <div ref={elementRef} className={ (!isVisible) ? "about-left" : "about-left fade-in" }>
                    <button className="get-issues-btn" onClick={getIssues}>Get Issues</button>
                </div>

                <div className={ (!isVisible) ? "about-right" : "about-right fade-in" }>
                  <div>
                    {
                      issues &&
                      issues.map((issue,i) => {
                        return (issue.status === "pending") ? <IssueCard issue={issue} ind ={i} tickPress={tickPress} crossPress={crossPress}/> : <></>
                      })
                    }
                  </div>
                </div>
            </div> 

            <Footer></Footer>
        </>
    )
}

function IssueCard({issue,ind,tickPress,crossPress}) {

  return(
    <div className="issue-card">
      <div>{issue.phoneno}</div>
      <div>
        <button className="tick-btn" onClick={() => tickPress(ind)}>&#10004;</button>
        <button className="cross-btn" onClick={() => crossPress(ind)}>&#10005;</button>
      </div>
    </div>
  )
}

export default Verifier