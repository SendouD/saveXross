import Footer from "./Footer.jsx";
import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import Bluexross from "../artifacts/contracts/Bluexross.sol/Bluexross.json";
import StakeTokens from "../artifacts/contracts/stakecoin.sol/StakeTokens.json";

function User({ blueAddress, stakeAddress, rewardAddress }) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [injury, setInjury] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [addres, setAddres] = useState("");
  const [issues, setIssues] = useState([]);
  const [isnewUser, setIsnewUser] = useState(true);
  const [issueBool, setIssueBool] = useState(false);
  const [bluecontract, setBluecontract] = useState(null); // Store contract instance
  const regex = /^[6789][0-9]{9}$/;

  // Initialize the contract instance once and store it in the state
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

  // Check if the user is new after the contract is initialized
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
        console.log("User is ", data);
        setIsnewUser(!data); // Update state according to contract response
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
        const receipt = await transaction.wait(); // Wait for the transaction to be mined
        if (receipt.status === 1) { // Check if the transaction was successful
          setIsnewUser(false); // Update the state to reflect that the user is no longer new
        } else {
          alert("Transaction failed!"); // Handle transaction failure
        }
      } catch (error) {
        alert("Error during transaction: " + error.message); // Handle any errors
      }
    }
  }

  async function getIssues() {
    setIssueBool(false);
    setIssues([]);
    if (bluecontract) {
      await requestAccount();
      const transaction = await bluecontract.getCheckAndReward();
      for (let i = 0; i < transaction.length; i++) {
        const issueDetails = await bluecontract.issues(transaction[i] - 1);
        setIssues((prev) => [...prev, issueDetails]);
      }
      boolIssues();
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
              issues.map((issue) => {
                return issue.status === "pending" ? (
                  <IssueCard issue={issue} ind={issue.Id} tickPress={tickPress} />
                ) : null;
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function IssueCard({ issue, ind, tickPress }) {
  return (
    <div className="issue-card">
      <div>
        <div>
          <span className="ban">ID: </span> {Number(issue.Id)}
        </div>
        <div>
          <span className="ban">Severity: </span> {issue.issue.toString()}
        </div>
        <div>
          <span className="ban">Address: </span> {issue.location.toString()}
        </div>
        <div>
          <span className="ban">Phone No: </span> {issue.contact}
        </div>
        <div>
          <span className="ban">Rescue Time: </span> {issue.time}
        </div>
        <div>
          <span className="ban">Status: </span> {issue.status}
        </div>
      </div>
      <button className="tick-btn" onClick={() => tickPress(ind)}>
        Complete a Rescue!
      </button>
    </div>
  );
}

export default User;
