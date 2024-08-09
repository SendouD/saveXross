import Header from "./Header.jsx"
import Footer from "./Footer.jsx"
import {useState, useEffect, useRef} from "react"
import { ethers } from "ethers"
import Bluexross from "../artifacts/contracts/Bluexross.sol/Bluexross.json"
import StakeTokens from "../artifacts/contracts/stakecoin.sol/StakeTokens.json"

function User({blueAddress, stakeAddress, rewardAddress}) {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [injury, setInjury] = useState("rescue");
    const [phoneno, setPhoneno] = useState("9999999999");
    const [addres, setAddres] = useState("karur,TN");
    const [stakeBalance, setStakeBalance ] = useState("");
    const [rewardBalance, setRewardBalance ] = useState("");
    const [issues, setIssues] = useState([]);
    const [ckverifer,setCkverifier]=useState(false);
    const [ckowner,setOwner]=useState(false);
 
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
  async function ckVerifyer() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
    const transaction = await bluecontract.CheckverifierAccess();
    setCkverifier(transaction) 
}
async function ckAdmin() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
  const transaction = await bluecontract.checkOwner();
  setOwner(transaction);
}
    async function requestAccount() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          console.log('Is intersecting:', entry.isIntersecting);
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 } 
      );
  
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      getBalance();
      setIssues([]);
      ckVerifyer();
      ckAdmin();
  
      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }, []);

    async function tickPress(index) {
      if(typeof window.ethereum !== "undefined") {
        await requestAccount();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
        const transaction = await bluecontract.CheckAndReward(index);
        await transaction.wait();
      }
    }

    async function settingIssue(event) {
      if(typeof window.ethereum !== "undefined") {
        await requestAccount();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
        const stakecontract = new ethers.Contract(stakeAddress, StakeTokens.abi, signer);
        await stakecontract.approve(blueAddress,5);
        const transaction = await bluecontract.IssueRescue(injury,phoneno,addres);
        await transaction.wait();
      }
      await getBalance();
    }

    async function settingNewUser(event) {
      if(typeof window.ethereum !== "undefined") {
        await requestAccount();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
        const stakecontract = new ethers.Contract(stakeAddress, StakeTokens.abi, signer);
        const transaction = await bluecontract.newUser();
        await transaction.wait();
      }
      await getBalance();
    }

    async function getIssues() {
      setIssues([]);
      if(typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        await requestAccount();
        const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
        const transaction = await bluecontract.getCheckAndReward();
        for(let i=0;i<transaction.length;i++) {
          const transaction1 = await bluecontract.issues(transaction[i]-1);
          console.log(transaction1);
          setIssues((prev)=>[...prev,transaction1]);
        }
      }
      await getBalance();
    }

    return(
        <>
            <Header blueAddress = {blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress} stakeBalance={stakeBalance} rewardBalance={rewardBalance} verified={ckverifer} admined={ckowner}/>

            <div className="body">
                <div ref={elementRef} className={ (!isVisible) ? "about-left" : "about-left fade-in" }>
                  <div className="form-inps">
                    <div className="form-name">Raise a Rescue!</div>
                    <input type="text" className="phoneno-inp" placeholder="Enter your Phone No.:" onChange={(e) => setPhoneno(e.target.value)}/>
                    <input type="text" className="address-inp" placeholder="Enter the Address" onChange={(e) => setAddres(e.target.value)}/>
                    <div>
                        <input type="radio" id="rescue" name="severity" value="rescue" onClick={(e) => setInjury(e.target.value)}/>
                        <label for="html">Rescue</label><br/>
                        <input type="radio" id="injury" name="severity" value="injury" onClick={(e) => setInjury(e.target.value)}/>
                        <label for="css">Injury</label><br/>
                        <input type="radio" id="accident" name="severity" value="accident" onClick={(e) => setInjury(e.target.value)}/>
                        <label for="javascript">Accident</label><br/>
                        <input type="radio" id="animal-abuse" name="severity" value="animalabuse" onClick={(e) => setInjury(e.target.value)}/>
                        <label for="javascript">Animal-Abuse</label>
                    </div>
                    <input type="file" className="gore-img" accept="image/*"/>
                    <button className="submit" onClick={settingIssue}>Initiate a Rescue!</button>
                    <button className="add-new-user" onClick={settingNewUser}>New User</button>
                    <button className="get-sender-issues-btn" onClick={getIssues}>Get issues</button>
                  </div>
                </div>

                <div className={ (!isVisible) ? "about-right" : "about-right fade-in" }>
                  {
                      issues &&
                      issues.map((issue) => {
                        return (issue.status === "pending") ? <IssueCard issue={issue} ind ={issue.Id} tickPress={tickPress}/> : null
                      })
                    }
                </div>
            </div>

            <Footer/>
        </>
    )
}

function IssueCard({issue,ind,tickPress}) {

  return(
    <div className="issue-card">
      <div>{issue.phoneno}</div>
      <div>
        <button className="tick-btn" onClick={() => tickPress(ind)}>&#10004;</button>
      </div>
    </div>
  )
}

export default User