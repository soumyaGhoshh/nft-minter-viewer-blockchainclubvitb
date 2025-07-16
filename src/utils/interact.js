import { pinJSONToIPFS } from './pinata.js';
import { ethers } from 'ethers';

// Load contract ABI and address from environment variables
const contractABI = require('../contract-abi.json');
// Access environment variables directly, CRA makes them available via process.env
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

/**
 * Mints a new NFT with the given metadata.
 * @param {string} url - The URL of the asset (e.g., image, video).
 * @param {string} name - The name of the NFT.
 * @param {string} description - The description of the NFT.
 * @param {Array<Object>} attributes - An array of NFT attributes (key-value pairs).
 * @returns {Promise<Object>} An object indicating success/failure and a status message.
 */
export const mintNFT = async (url, name, description, attributes = []) => {
  // Input validation: Ensure essential fields are not empty
  if (!url.trim() || !name.trim() || !description.trim()) {
    return {
      success: false,
      status: "❗Please ensure all required fields (Asset URL, Name, Description) are filled.",
    };
  }

  // Construct NFT metadata object, filtering out empty attributes
  const metadata = {
    name,
    image: url,
    description,
    attributes: attributes.filter(attr => attr.key.trim() !== "" && attr.value.trim() !== "")
  };

  try {
    // 1. Pin metadata JSON to IPFS via Pinata
    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
      return {
        success: false,
        status: `❌ IPFS upload failed: ${pinataResponse.message || "Something went wrong while uploading your tokenURI."}`,
      };
    }
    const tokenURI = pinataResponse.pinataUrl;

    // 2. Interact with the Ethereum contract using ethers.js
    // Check if MetaMask (window.ethereum) is available
    if (!window.ethereum) {
      return {
        success: false,
        status: "🦊 MetaMask is not installed. Please install it to mint NFTs.",
      };
    }

    // Create a Web3Provider from MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Get the signer (connected account)
    const signer = provider.getSigner();
    // Create a contract instance
    const nftContract = new ethers.Contract(contractAddress, contractABI, signer);

    // 3. Call the mintNFT function on your smart contract
    // The `mintNFT` function is assumed to take `to` address and `tokenURI`
    const transaction = await nftContract.mintNFT(await signer.getAddress(), tokenURI);
    // Wait for the transaction to be mined
    await transaction.wait();

    return {
      success: true,
      status: `✅ NFT minted successfully! View transaction on Etherscan: https://sepolia.etherscan.io/tx/${transaction.hash}`
    };
  } catch (error) {
    console.error("Error minting NFT:", error); // Log detailed error for debugging
    let errorMessage = "An unexpected error occurred during minting.";
    if (error.code === 4001) { // User rejected transaction
      errorMessage = "Transaction rejected by user.";
    } else if (error.message.includes("insufficient funds")) {
      errorMessage = "Insufficient funds for transaction. Please check your wallet balance.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      status: `😥 Minting failed: ${errorMessage}`
    };
  }
};

/**
 * Connects the user's MetaMask wallet.
 * @returns {Promise<Object>} An object containing the connected address and a status message.
 */
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []); // Request account access
      return {
        status: "Wallet connected. You can now mint your NFT!",
        address: accounts[0],
      };
    } catch (err) {
      console.error("Error connecting wallet:", err);
      return {
        address: "",
        status: `😥 Connection failed: ${err.message || "Please check MetaMask."}`,
      };
    }
  } else {
    // MetaMask is not installed
    return {
      address: "",
      status: (
        <span>
          <p>
            🦊{" "}
            <a target="_blank" rel="noopener noreferrer" href="https://metamask.io/download.html">
              MetaMask is not installed. Please click here to install.
            </a>
          </p>
        </span>
      ),
    };
  }
};

/**
 * Checks the currently connected MetaMask wallet and its status.
 * @returns {Promise<Object>} An object containing the current address and a status message.
 */
export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts(); // Get currently connected accounts
      if (accounts.length > 0) {
        return {
          address: accounts[0],
          status: "Wallet connected. Ready to mint!",
        };
      } else {
        return {
          address: "",
          status: "Connect to MetaMask using the 'Connect Wallet' button.",
        };
      }
    } catch (err) {
      console.error("Error getting current wallet connection:", err);
      return {
        address: "",
        status: `😥 Failed to get wallet status: ${err.message || "Please check MetaMask."}`,
      };
    }
  } else {
    // MetaMask is not installed
    return {
      address: "",
      status: (
        <span>
          <p>
            🦊{" "}
            <a target="_blank" rel="noopener noreferrer" href="https://metamask.io/download.html">
              MetaMask is not installed. Please click here to install.
            </a>
          </p>
        </span>
      ),
    };
  }
};
