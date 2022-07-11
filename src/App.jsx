import React, { useEffect, useState} from 'react';
import './styles/App.css';
import WebLogo from './assets/weblink.png';
import myEpicNft from './utils/MyEpicNFT.json';
import { ethers } from "ethers";
import mining from "./assets/mining.json";
import Lottie from "lottie-react";

// Constants
const MY_HANDLE = '_shaoqing';
const WEB_LINK = `https://shaoqing.netlify.app/`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = '0xCE206d5Ff66eEB388eD05346A28fAf63e36d3145';

const App = () => {

  // State variable to store user's public wallet.
  const[currentAccount, setCurrentAccount] = useState("");
  
  const[mintButton, setMintButton] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const checkIfWalletIsConnected = async () => {
    // Make sure we have access to window.ethereum
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("we have the ethereum object", ethereum);
    }

    // Check if we're authorized to access user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts'});

    // User can have multiple authorized accounts, we grab first one
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      //This is for the case where a user comes to our site
      // and Already had their wallet connected + authorized
      setupEventListener()
    } else {
      console.log("No authorized account found");
    }
  }

  // Implement connectWallet method
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      // Method to request access to account
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      setupEventListener()
    } catch (error) {
      console.log(error);
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // This will "capture" our event when our contract throws it
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {          // If minting is on going, then tell its finished
         /* if(mintButton) {
            setMintButton(false)
          }*/
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and send it to your wallet. It may be blank right now.It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });
        
        console.log("Setup event listener!")
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  // Mint NFT 
  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        setMintButton(true)
        setShowAnimation(true)
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait");
        setMintButton(true);
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
    setMintButton(false);
    setShowAnimation(false);
  }

  const getTotalNFTsMintedSoFar = async () => {
    
  }
  
    // Runs our function when page loads
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      { mintButton ? 'Minting NFT...Please Wait' : 'Mint NFT' }
      </button>
  )
  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Dinner Collection</p>
          <p className="sub-text">
            What to eat for dinner? Randomized NFT menu will tell ya!
          </p>
          {currentAccount === "" 
            ? renderNotConnectedContainer() : renderMintUI()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={WebLogo} />

          {showAnimation && (<Lottie
          className="mining"
          animationData={mining}
          autoplay={true}
          loop={true}
          />
        )}
          
          <a
            className="footer-text"
            href={WEB_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${MY_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;