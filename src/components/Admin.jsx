import Footer from "./Footer.jsx";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Bluexross from "../artifacts/contracts/Bluexross.sol/Bluexross.json";

function Admin({ blueAddress }) {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [address, setAddress] = useState("");
    const navigate = useNavigate();
    const bluecontractRef = useRef(null); // useRef to store contract instance

    function handleAccountChange() {
        navigate("/user");
    }

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bluecontract = new ethers.Contract(blueAddress, Bluexross.abi, signer);
        bluecontractRef.current = bluecontract; // Store the contract instance

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountChange);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", handleAccountChange);
            }
        };
    }, [blueAddress]); // Dependency array ensures contract is only set when blueAddress changes

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
        if (typeof window.ethereum !== "undefined" && bluecontractRef.current) {
            await requestAccount();

            try {
                const transaction = await bluecontractRef.current.GrantVerifyAccess(address);
                await transaction.wait();
                alert("Access granted successfully");
            } catch (error) {
                console.error("Error granting access:", error);
            }
        } else {
            console.error("Ethereum provider not found");
        }
    }

    return (
        <>
            <div className="body">
                <div ref={elementRef} className={(!isVisible) ? "about-left refe" : "about-left fade-in refe"}>
                    <div>
                        <div className="form-name goof">Admin Portal</div>
                        <input
                            type="text"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <button className="verifier-access-btn submit" onClick={giveAccess}>Give Access</button>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Admin;
