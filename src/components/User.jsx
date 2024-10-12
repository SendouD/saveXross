import Footer from "./Footer.jsx";
import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import Bluexross from "../artifacts/contracts/Bluexross.sol/Bluexross.json";
import StakeTokens from "../artifacts/contracts/stakecoin.sol/StakeTokens.json";
import IssueCard from "./IssueCard.jsx";


function User({ blueAddress, stakeAddress }) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [injury, setInjury] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [addres, setAddres] = useState("");
  const [issues, setIssues] = useState([]);
  const [isnewUser, setIsnewUser] = useState(true);
  const [issueBool, setIssueBool] = useState(false);
  const [bluecontract, setBluecontract] = useState(null);
  const regex = /^[6789][0-9]{9}$/;

  useEffect(() => {
    async function initContract() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(blueAddress, Bluexross.abi, signer);
        setBluecontract(contractInstance);
      }
    }
    initContract();
  }, [blueAddress]);

  useEffect(() => {
    if (bluecontract) {
      checkNewUser();
    }
  }, [bluecontract]);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    setIssues([]);

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  async function checkNewUser() {
    if (bluecontract) {
      try {
        const data = await bluecontract.isAUser();
        setIsnewUser(!data);
      } catch (error) {
        console.error("Error checking new user:", error);
      }
    }
  }

  async function tickPress(index) {
    if (bluecontract) {
      await requestAccount();
      try {
        const transaction = await bluecontract.CheckAndReward(index);
        await transaction.wait();
        alert("[Stake Coins reverted: 5]   [Reward Coins: 2]");
      } catch (error) {
        alert("Still Pending!");
      }
      getIssues();
    }
  }

  async function settingIssue() {
    if (!regex.test(phoneno) || addres.length < 8) {
      alert("Enter a valid Phone No.: / Address");
    } else if (bluecontract) {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const stakecontract = new ethers.Contract(stakeAddress, StakeTokens.abi, signer);

      try {
        await stakecontract.approve(blueAddress, 5);
        const transaction = await bluecontract.IssueRescue(injury, phoneno, addres);
        await transaction.wait();
      } catch (error) {
        alert("Not enough Staking coins!");
      }
    }
  }

  async function settingNewUser() {
    if (bluecontract) {
      await requestAccount();
      try {
        const transaction = await bluecontract.newUser();
        const receipt = await transaction.wait();
        if (receipt.status === 1) {
          setIsnewUser(false);
        } else {
          alert("Transaction failed!");
        }
      } catch (error) {
        alert("Error during transaction: " + error.message);
      }
    }
  }

  async function getIssues() {
    setIssueBool(false);
    setIssues([]);

    if (bluecontract) {
      await requestAccount();

      try {
        const issueIds = await bluecontract.getCheckAndReward();
        console.log("Issue IDs: ", issueIds);

        const fetchedIssues = [];
        for (let i = 0; i < issueIds.length; i++) {
          const issueDetails = await bluecontract.issues(issueIds[i] - 1);
          console.log(`Issue details for ID ${issueIds[i]}: `, issueDetails);

          const issue = {
            user: issueDetails[0],
            Id: issueDetails[1].toNumber(),
            phoneno: issueDetails[2].toNumber(),
            addres: issueDetails[3],
            time: issueDetails[5].toNumber(),
          };
          console.log("Processed issue: ", issue);
          fetchedIssues.push(issue);
        }

        console.log("Fetched Issues: ", fetchedIssues);
        setIssues(fetchedIssues);
        boolIssues();
      } catch (error) {
        console.error("Error fetching issues: ", error);
      }
    }
  }

  function boolIssues() {
    issues.forEach((issue) => {
      if (issue.status === "pending") {
        setIssueBool(true);
      }
    });
  }

  return (
    <>
      <div className="body">
        <div ref={elementRef} className={!isVisible ? "about-left" : "about-left fade-in"}>
          <div className="form-inps">
            {!isnewUser ? (
              <div className="forminp">
                <div className="form-name">Raise a Rescue!</div>
                <input
                  type="text"
                  className="phoneno-inp"
                  placeholder="Enter your Phone No.:"
                  onChange={(e) => setPhoneno(e.target.value)}
                  pattern="[789][0-9]{9}"
                  required
                />
                <input
                  type="text"
                  className="address-inp"
                  placeholder="Enter the Address"
                  onChange={(e) => setAddres(e.target.value)}
                  required
                />
                <div>
                  <input
                    type="radio"
                    id="rescue"
                    name="severity"
                    value="rescue"
                    onClick={(e) => setInjury(e.target.value)}
                  />
                  <label htmlFor="rescue">Rescue</label>
                  <br />
                  <input
                    type="radio"
                    id="injury"
                    name="severity"
                    value="injury"
                    onClick={(e) => setInjury(e.target.value)}
                  />
                  <label htmlFor="injury">Injury</label>
                  <br />
                  <input
                    type="radio"
                    id="accident"
                    name="severity"
                    value="accident"
                    onClick={(e) => setInjury(e.target.value)}
                  />
                  <label htmlFor="accident">Accident</label>
                  <br />
                  <input
                    type="radio"
                    id="animal-abuse"
                    name="severity"
                    value="animalabuse"
                    onClick={(e) => setInjury(e.target.value)}
                  />
                  <label htmlFor="animal-abuse">Animal Abuse</label>
                </div>
                <button className="submit" onClick={settingIssue}>
                  Initiate a Rescue!
                </button>
                <button className="get-sender-issues-btn" onClick={getIssues}>
                  Get issues
                </button>
              </div>
            ) : (
              <button className="add-new-user" onClick={settingNewUser}>
                New User<div>(use Sepolia)</div>
              </button>
            )}
          </div>
        </div>

        <div className={!isVisible ? "about-right" : "about-right fade-in"}>
          <div>
            {issues.length === 0 ? (
              <div className="no-issues">No Issues</div>
            ) : (
              <div className="issues-container">
                {issues.map((issue) => (
                  <IssueCard
                    key={issue.Id}
                    id={issue.Id}     
                    user={issue.user}           
                    phoneNo={issue.phoneno}    
                    address={issue.addres}  
                    tickPress={tickPress}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default User;
