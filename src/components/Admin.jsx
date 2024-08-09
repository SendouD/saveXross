import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import Bluexross from "../artifacts/contracts/Bluexross.sol/Bluexross.json";

function Admin({ blueAddress, stakeAddress, rewardAddress }) {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [address, setAddress] = useState("");
    const [stakeBalance, setStakeBalance] = useState("");
    const [rewardBalance, setRewardBalance] = useState("");
    const [ckverifer,setCkverifier]=useState(false);

    async function ckVerifyer() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
        const transaction = await bluecontract.CheckverifierAccess();
        setCkverifier(transaction) 
        
    }

    useEffect(() => {
        getBalance();
        ckVerifyer();

    }, []);

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

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function giveAccess() {
        if (typeof window.ethereum !== "undefined") {
            await requestAccount();

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
            try {
                const transaction = await bluecontract.GrantVerifyAccess(address);
                await transaction.wait();
                console.log("Access granted successfully");
            } catch (error) {
                console.error("Error granting access:", error);
            }
        } else {
            console.error("Ethereum provider not found");
        }
        await getBalance();
    }

    return (
        <>
            <Header 
                blueAddress={blueAddress} stakeAddress={stakeAddress} rewardAddress={rewardAddress} stakeBalance={stakeBalance} rewardBalance={rewardBalance} verified={ckverifer} admined={true}/>

            <div className="body">
                <div ref={elementRef} className={(!isVisible) ? "about-left" : "about-left fade-in"}>
                    <input
                        type="text"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <button className="verifier-access-btn" onClick={giveAccess}>Give Access</button>
                </div>

                <div className={(!isVisible) ? "about-right" : "about-right fade-in"}>
                </div>
            </div>

            <Footer></Footer>
        </>
    );
}

export default Admin;
