import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./css/Header.css";
import Bluexross from "../artifacts/contracts/Bluexross.sol/Bluexross.json";

function Header({ blueAddress, stakeAddress, rewardAddress, stakeBalance, rewardBalance }) {

    return (
        <>
            <div className="center-header">
                <div className="header-body">
                    <div className="header-left">
                        <div className="logo-name">BlueXross</div>
                    </div>

                    <div className="header-middle">
                        <a href="/user" className="nav-links">User</a>
                        <a href="/verifier" className="nav-links">Verifier</a>
                        <a href="/admin" className="nav-links">Admin</a>
                    </div>

                    <div className="header-right">
                        <button className="rescue-btn">Raise a Rescue!</button>
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
