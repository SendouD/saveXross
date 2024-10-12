import Footer from "./Footer.jsx";
import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import Bluexross from "../artifacts/contracts/Bluexross.sol/Bluexross.json";

function Verifier({ blueAddress, stakeAddress, rewardAddress }) {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [issues, setIssues] = useState([]);
    const [bluecontract, setBlueContract] = useState(null); // Store contract instance
    const navigate = useNavigate();

    // Helper function to get provider, signer, and contract instance
    async function setupContract() {
        if (typeof window.ethereum!== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(blueAddress, Bluexross.abi, signer);
            setBlueContract(contractInstance);  // Store contract in state
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        // Initialize contract and fetch data only once when the component mounts
        setupContract();

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountChange);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", handleAccountChange);
            }
        };
    }, []); // Empty dependency array to run effect only once

    function handleAccountChange() {
        navigate("/user");
    }

    async function getIssues() {
        setIssues([]);
        if (bluecontract) {
            try {
                const data = await bluecontract.getIssues();
                setIssues(data.map(issue => ({
                    ...issue,
                    Id: Number(issue.Id.toString()),
                    phoneno: Number(issue.phoneno.toString())
                })));
            } catch (error) {
                console.log("Error fetching issues: ", error);
            }
        }
    }
    

    async function handleVerifyAction(action, index) {
        if (bluecontract) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const transaction = await bluecontract.IssueVerify(action, index + 1);
                await transaction.wait();
                getIssues();
            } catch (error) {
                console.log(`Error verifying issue ${action ? 'cross' : 'tick'}:`, error);
            }
        }
    }

    return (
        <>
            <div className="body">
                <div ref={elementRef} className={(!isVisible)? "about-left" : "about-left fade-in"}>
                    <div className="arcs">
                        <div className="form-name goof">Verify Portal</div>
                        <button className="get-issues-btn submit" onClick={getIssues}>Get Issues</button>
                    </div>
                </div>
                <div className={(!isVisible)? "about-right" : "about-right fade-in"}>
                    <div>
                        {issues.length === 0 ? (
                            <div className="no-issues">No Issues</div>
                        ) : (
                            issues.map((issue, i) => (
                                <IssueCard key={i} issue={issue} index={i} handleVerifyAction={handleVerifyAction} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function IssueCard({ issue, index, handleVerifyAction }) {
    return (
        <div className="issue-card">
            <div>
                <div><span className="ban">ID: </span> {Number(issue.Id.toString())}</div>
                <div><span className="ban">User: </span> {issue.user}</div>
                <div><span className="ban">Address: </span> {issue.addres}</div>
                <div><span className="ban">Phone No.: </span> {issue.phoneno.toString()}</div>
            </div>
            <div>
                <button className="tick-btn submit" onClick={() => handleVerifyAction(false, index)}>&#10004;</button>
                <button className="cross-btn submit" onClick={() => handleVerifyAction(true, index)}>&#10005;</button>
            </div>
        </div>
    );
}

export default Verifier;
